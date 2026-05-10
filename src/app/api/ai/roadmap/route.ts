import { NextResponse } from 'next/server';
import { generateCareerRoadmap } from '@/lib/ai/gemini';
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

    const { currentSkills, targetRole } = await req.json();

    if (!currentSkills || !targetRole) {
      return NextResponse.json({ error: 'Missing skills or target role' }, { status: 400 });
    }

    // Call Gemini API utility
    const roadmapResult = await generateCareerRoadmap(currentSkills, targetRole);

    // Save report to MongoDB
    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    
    if (user) {
      await AiReport.create({
        studentId: user._id,
        reportType: 'CareerRoadmap',
        content: roadmapResult
      });
    }

    return NextResponse.json(roadmapResult);
  } catch (error) {
    console.error('Career Roadmap API Error:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}
