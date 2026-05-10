import { NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/ai/gemini';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/CoreModels';

/**
 * Generates 5 quiz questions for a course topic using Gemini AI
 * POST /api/ai/quiz
 * body: { courseId, courseTitle, topic }
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, courseTitle, topic } = await req.json();

    if (!courseId || !courseTitle || !topic) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.enrolledCourses?.includes(courseId)) {
      return NextResponse.json({ 
        error: 'Access Denied', 
        message: 'You must be enrolled in this course to access the quiz.' 
      }, { status: 403 });
    }

    const questions = await generateQuiz(courseTitle, topic);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
