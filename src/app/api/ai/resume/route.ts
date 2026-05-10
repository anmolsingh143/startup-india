import { NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/ai/gemini';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { AiReport } from '@/models/AnalyticsModels';
import { User } from '@/models/CoreModels';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeText, targetJob } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    // Call Gemini API utility
    const analysisResult = await analyzeResume(resumeText, targetJob);

    // Save report to MongoDB
    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    
    if (user) {
      await AiReport.create({
        studentId: user._id,
        reportType: 'ResumeAnalysis',
        content: analysisResult,
        score: analysisResult.atsScore
      });
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Resume Analysis API Error:', error);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
