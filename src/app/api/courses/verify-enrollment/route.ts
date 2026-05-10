import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/CoreModels';

/**
 * Checks if the current user is enrolled in a specific course
 * GET /api/courses/verify-enrollment?courseId=...
 */
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ enrolled: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ enrolled: false, message: 'User not found' }, { status: 404 });
    }

    const isEnrolled = user.enrolledCourses?.includes(courseId) || false;

    return NextResponse.json({ enrolled: isEnrolled });
  } catch (error) {
    console.error('Enrollment verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
