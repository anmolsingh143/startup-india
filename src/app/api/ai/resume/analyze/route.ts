import { NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/ai/gemini';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeText, targetJobDescription } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    const analysis = await analyzeResume(resumeText, targetJobDescription);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Resume analysis API error:', error);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
