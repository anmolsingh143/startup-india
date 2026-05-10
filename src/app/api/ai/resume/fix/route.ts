import { NextResponse } from 'next/server';
import { fixResume } from '@/lib/ai/gemini';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeText, targetJobDescription } = await req.json();

    if (!resumeText || !targetJobDescription) {
      return NextResponse.json({ error: 'Resume text and target job description are required' }, { status: 400 });
    }

    const optimization = await fixResume(resumeText, targetJobDescription);

    return NextResponse.json(optimization);
  } catch (error) {
    console.error('Resume fix API error:', error);
    return NextResponse.json({ error: 'Failed to optimize resume' }, { status: 500 });
  }
}
