// utils/ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

type generateContentProps = {
  SYSTEM_PROMPT: {
    content: string;
  };
  modelName: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const SYSTEM_PROMPT = {
  content:
    "Generate 3 to 5 concise open-ended, one-line questions for a social Q&A platform like Qooh.com. Each question should be short, friendly, and universal—no personal or sensitive topics. Separate questions with '||'. Focus on curiosity, positivity, and casual interaction."
};



// const createMessageString = (messages: string) => {
//   return `${messages}`

// };

export async function generateContent({ SYSTEM_PROMPT, modelName = "gemini-2.0-flash" }: generateContentProps) {
  try {
    const modelAi = genAI.getGenerativeModel({ model: modelName });
    const result = await modelAi.generateContent(SYSTEM_PROMPT.content);
    const output = result.response?.text();
    return NextResponse.json({ output: output }, { status: 200 })
  } catch (error) {
    console.error("Error generating content:", error);
    return null; // Or throw the error if you prefer error handling in the caller
  }
}

