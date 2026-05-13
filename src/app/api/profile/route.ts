import { auth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/CoreModels";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkAuth = await auth();
    
    if (!clerkAuth.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkAuth.userId });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const clerkAuth = await auth();
    
    if (!clerkAuth.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();

    const user = await User.findOneAndUpdate(
      { clerkId: clerkAuth.userId },
      {
        $set: {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          headline: body.headline,
          linkedinProfileUrl: body.linkedinProfileUrl,
          linkedinHeadline: body.linkedinHeadline,
          linkedinSummary: body.linkedinSummary,
          professionalSummary: body.professionalSummary,
          profileSkills: body.profileSkills,
          experienceHighlights: body.experienceHighlights,
          careerGoals: body.careerGoals,
          education: body.education,
        }
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

