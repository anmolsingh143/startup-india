import { NextResponse } from 'next/server';
import { generateLinkedInProfile } from '@/lib/ai/gemini';
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

    const {
      fullName,
      currentRole,
      yearsExperience,
      skills,
      targetRole,
      summary,
      linkedinProfileUrl
    } = await req.json();

    if (!currentRole || !skills?.length || !targetRole) {
      return NextResponse.json({ error: 'Missing required profile details' }, { status: 400 });
    }

    const profileResult = await generateLinkedInProfile({
      fullName,
      currentRole,
      yearsExperience,
      skills,
      targetRole,
      summary,
      linkedinProfileUrl
    });

    await dbConnect();

    const user = await User.findOne({ clerkId: userId });
    if (user) {
      user.headline = profileResult.headline;
      user.linkedinHeadline = profileResult.linkedinHeadline;
      user.linkedinSummary = profileResult.linkedinSummary;
      user.professionalSummary = profileResult.professionalSummary;
      user.experienceHighlights = profileResult.experienceHighlights;
      user.careerGoals = [profileResult.careerGoal];
      user.profileSkills = profileResult.skills;
      user.linkedinProfileUrl = linkedinProfileUrl;
      await user.save();

      await AiReport.create({
        studentId: user._id,
        reportType: 'LinkedInProfile',
        content: profileResult
      });
    }

    return NextResponse.json(profileResult);
  } catch (error) {
    console.error('LinkedIn Profile API Error:', error);
    return NextResponse.json({ error: 'Failed to generate profile' }, { status: 500 });
  }
}
