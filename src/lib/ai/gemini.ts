import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const DEFAULT_MODEL = 'gemini-1.5-flash'; // Optimized for speed and JSON

/**
 * Analyzes a resume string and returns structured JSON feedback including ATS score and missing skills.
 */
export async function analyzeResume(resumeText: string, targetJobDescription?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
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
    
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
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
      const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
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
      
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
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
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
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
    
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error in generateCareerRoadmap:', error);
    throw new Error('Failed to generate career roadmap');
  }
}

/**
 * Generates 5 AI quiz questions for a given course topic
 */
export async function generateQuiz(courseTitle: string, topic: string) {
  try {
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
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

    const raw = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(raw);
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
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
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

    const raw = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error in generateCertificateContent:', error);
    throw new Error('Failed to generate certificate content');
  }
}
