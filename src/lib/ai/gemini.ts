import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_MODEL = 'gemini-1.5-flash'; // Optimized for speed and JSON
let cachedModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!cachedModel) {
    const genAI = new GoogleGenerativeAI(apiKey);
    cachedModel = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    });
  }

  return cachedModel;
}

function parseJsonResponse<T>(responseText: string): T {
  const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  const jsonStart = Math.min(
    ...['{', '[']
      .map((token) => cleanText.indexOf(token))
      .filter((index) => index >= 0)
  );
  const jsonEnd = Math.max(cleanText.lastIndexOf('}'), cleanText.lastIndexOf(']'));
  const json = jsonStart >= 0 && jsonEnd >= jsonStart
    ? cleanText.slice(jsonStart, jsonEnd + 1)
    : cleanText;

  return JSON.parse(json) as T;
}

/**
 * Analyzes a resume string and returns structured JSON feedback including ATS score and missing skills.
 */
export async function analyzeResume(resumeText: string, targetJobDescription?: string) {
  try {
    const model = getGeminiModel();
    const prompt = `
      Act as a senior technical recruiter and ATS (Applicant Tracking System) expert.
      Analyze the following resume text.
      ${targetJobDescription ? `Compare it against this target job description: ${targetJobDescription}` : ''}
      
      Return a pure JSON object (no markdown formatting) with the following structure:
      {
        "atsScore": number (0-100),
        "strengths": string[],
        "weaknesses": string[],
        "missingSkills": string[],
        "recommendations": string[]
      }
      
      Resume Text:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return parseJsonResponse<{
      atsScore: number;
      strengths: string[];
      weaknesses: string[];
      missingSkills: string[];
      recommendations: string[];
    }>(responseText);
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    throw new Error('Failed to analyze resume via Gemini API');
  }
}

/**
 * Fixes/Optimizes resume text for ATS and better impact.
 */
export async function fixResume(resumeText: string, targetJobDescription: string) {
    try {
      const model = getGeminiModel();
      const prompt = `
        You are an expert resume writer. Rewrite the following resume sections to be highly impactful, 
        using action verbs and quantifying achievements. Optimize it specifically for this Job Description.
        
        Return a JSON object:
        {
          "optimizedExperience": string,
          "suggestedKeywords": string[],
          "summaryRewrite": string
        }
  
        Resume Text: ${resumeText}
        Job Description: ${targetJobDescription}
      `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      return parseJsonResponse<{
        optimizedExperience: string;
        suggestedKeywords: string[];
        summaryRewrite: string;
      }>(responseText);
    } catch (error) {
      console.error('Error in fixResume:', error);
      throw new Error('Failed to fix resume');
    }
}

/**
 * Generates an AI Career Roadmap based on user skills and target role
 */
export async function generateCareerRoadmap(currentSkills: string[], targetRole: string) {
  try {
    const model = getGeminiModel();
    const prompt = `
      Create a step-by-step career roadmap for someone aiming to become a ${targetRole}.
      Their current skills are: ${currentSkills.join(', ')}.
      
      Return a pure JSON object representing the learning path:
      {
        "estimatedMonthsToTarget": number,
        "phases": [
          {
            "phaseName": string,
            "duration": string,
            "skillsToAcquire": string[],
            "projectIdea": string
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return parseJsonResponse<{
      estimatedMonthsToTarget: number;
      phases: {
        phaseName: string;
        duration: string;
        skillsToAcquire: string[];
        projectIdea: string;
      }[];
    }>(responseText);
  } catch (error) {
    console.error('Error in generateCareerRoadmap:', error);
    throw new Error('Failed to generate career roadmap');
  }
}

export async function generateLinkedInProfile(input: {
  fullName?: string;
  currentRole: string;
  yearsExperience?: string;
  skills: string[];
  targetRole: string;
  summary?: string;
  linkedinProfileUrl?: string;
}) {
  try {
    const model = getGeminiModel();
    const prompt = `
      You are an expert career coach and LinkedIn profile writer for early career professionals.
      Given the user's current role, experience, skills, and target role, generate a powerful LinkedIn-ready profile summary.
      Use concise language, strong action verbs, and highlight career goals.
      Return only a valid JSON object with this exact structure:
      {
        "headline": "string",
        "linkedinHeadline": "string",
        "linkedinSummary": "string",
        "professionalSummary": "string",
        "experienceHighlights": string[],
        "skills": string[],
        "careerGoal": "string"
      }

      User Context:
      Full Name: ${input.fullName || 'Unknown'}
      Current Role: ${input.currentRole}
      Years of Experience: ${input.yearsExperience || 'Not specified'}
      Skills: ${input.skills.join(', ')}
      Target Role: ${input.targetRole}
      Summary: ${input.summary || 'No additional summary provided'}
      LinkedIn Profile URL: ${input.linkedinProfileUrl || 'Not provided'}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    return parseJsonResponse<{
      headline: string;
      linkedinHeadline: string;
      linkedinSummary: string;
      professionalSummary: string;
      experienceHighlights: string[];
      skills: string[];
      careerGoal: string;
    }>(responseText);
  } catch (error) {
    console.error('Error in generateLinkedInProfile:', error);
    throw new Error('Failed to generate LinkedIn profile');
  }
}

/**
 * Generates 5 AI quiz questions for a given course topic
 */
export async function generateQuiz(courseTitle: string, topic: string) {
  try {
    const model = getGeminiModel();
    const prompt = `
      You are an expert educator creating a quiz for a course on "${courseTitle}".
      The lesson just completed was about: "${topic}".
      Generate exactly 5 multiple choice quiz questions to test the student's understanding.
      Return ONLY a valid JSON array (no markdown, no explanation) with this exact structure:
      [
        {
          "id": 1,
          "question": "string",
          "options": ["A. option", "B. option", "C. option", "D. option"],
          "correctAnswer": "A. option",
          "explanation": "Brief explanation of why this is correct"
        }
      ]
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    return parseJsonResponse<{
      id: number;
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }[]>(responseText);
  } catch (error) {
    console.error('Error in generateQuiz:', error);
    throw new Error('Failed to generate quiz');
  }
}

/**
 * Generates certificate content for a completed course
 */
export async function generateCertificateContent(
  studentName: string,
  courseTitle: string,
  quizScore: number,
  totalQuestions: number,
  completionDate: string,
  verificationHash: string
) {
  try {
    const model = getGeminiModel();
    const prompt = `
      Generate formal completion certificate data for:
      - Student Name: ${studentName}
      - Course: ${courseTitle}
      - Quiz Score: ${quizScore}/${totalQuestions}
      - Date: ${completionDate}
      - Verification ID: ${verificationHash}
      - Issued by: Startup India Technologies Pvt. Ltd.

      Return a JSON object (no markdown):
      {
        "certificateTitle": "Certificate of Completion",
        "studentName": "${studentName}",
        "courseTitle": "${courseTitle}",
        "completionDate": "${completionDate}",
        "achievement": "string describing their achievement in 1 sentence",
        "quizScore": "${quizScore}/${totalQuestions}",
        "grade": "Distinction or Merit or Pass based on score percentage",
        "verificationId": "${verificationHash}",
        "issuedBy": "Startup India Technologies Pvt. Ltd."
      }
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    return parseJsonResponse<{
      certificateTitle: string;
      studentName: string;
      courseTitle: string;
      completionDate: string;
      achievement: string;
      quizScore: string;
      grade: string;
      verificationId: string;
      issuedBy: string;
    }>(responseText);
  } catch (error) {
    console.error('Error in generateCertificateContent:', error);
    throw new Error('Failed to generate certificate content');
  }
}

export type AdminInsightSnapshot = {
  totals: {
    users: number;
    leads: number;
    successfulPayments: number;
    applications: number;
    revenue: number;
  };
  leadStatuses: { status: string; count: number }[];
  paymentStatuses: { status: string; count: number; revenue: number }[];
  revenueByItemType: { itemType: string; revenue: number; count: number }[];
  recentLeads: { name: string; status: string; source: string; assignedTo?: string; createdAt?: string }[];
  recentPayments: { status: string; amount: number; itemType?: string; createdAt?: string }[];
  employeePerformance: { name: string; leads: number; conversions: number }[];
};

export type AdminInsightResponse = {
  summary: string;
  opportunities: string[];
  risks: string[];
  recommendedActions: string[];
  leadSegments: { label: string; count: number; action: string }[];
  revenueForecast: {
    next30Days: string;
    confidence: 'Low' | 'Medium' | 'High';
    reasoning: string;
  };
};

export async function generateAdminInsights(snapshot: AdminInsightSnapshot) {
  try {
    const model = getGeminiModel();
    const prompt = `
      You are an expert revenue operations analyst for an Indian edtech/internship platform.
      Analyze this admin dashboard snapshot and return only JSON. Be specific, operational,
      and useful for an admin team that manages leads, payments, applications, and employees.

      Snapshot:
      ${JSON.stringify(snapshot)}

      Return this exact JSON structure:
      {
        "summary": "2 sentence executive summary",
        "opportunities": ["3 concrete growth opportunities"],
        "risks": ["3 operational or revenue risks"],
        "recommendedActions": ["5 prioritized admin actions for the next 48 hours"],
        "leadSegments": [
          { "label": "segment name", "count": number, "action": "recommended follow-up" }
        ],
        "revenueForecast": {
          "next30Days": "INR amount or range as a string",
          "confidence": "Low" | "Medium" | "High",
          "reasoning": "short explanation"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseJsonResponse<AdminInsightResponse>(response.text());
  } catch (error) {
    console.error('Error in generateAdminInsights:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate admin insights');
  }
}
