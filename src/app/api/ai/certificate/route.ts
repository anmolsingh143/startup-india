import { NextResponse } from 'next/server';
import { generateCertificateContent } from '@/lib/ai/gemini';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { Certificate } from '@/models/CourseModels';
import { User } from '@/models/CoreModels';
import crypto from 'crypto';

/**
 * Generates an AI-powered certificate for a completed course
 * POST /api/ai/certificate
 * body: { courseId, courseTitle, quizScore, totalQuestions }
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, courseTitle, quizScore, totalQuestions } = await req.json();

    if (!courseId || !courseTitle) {
      return NextResponse.json({ error: 'Missing course details' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    if (!user || !user.enrolledCourses?.includes(courseId)) {
      return NextResponse.json({ 
        error: 'Access Denied', 
        message: 'You must be enrolled in this course to generate a certificate.' 
      }, { status: 403 });
    }

    const verificationHash = crypto
      .createHash('sha256')
      .update(`${userId}-${courseId}-${Date.now()}`)
      .digest('hex')
      .slice(0, 16)
      .toUpperCase();

    const completionDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    const certData = await generateCertificateContent(
      user.name,
      courseTitle,
      quizScore,
      totalQuestions,
      completionDate,
      verificationHash
    );

    // Persist certificate record
    const certificate = await Certificate.create({
      studentId: user._id,
      type: 'Course',
      issueDate: new Date(),
      certificateUrl: `/certificate/${verificationHash}`,
      verificationHash,
    });

    return NextResponse.json({
      success: true,
      certificate: { ...certData, _id: certificate._id, verificationHash },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
