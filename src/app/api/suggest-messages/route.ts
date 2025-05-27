import { NextRequest } from "next/server";
import { generateContent } from "@/helpers/geminiService";
import { SYSTEM_PROMPT } from "@/helpers/geminiService";

export async function GET(request: NextRequest) {
  try {
    const response = await generateContent({
      SYSTEM_PROMPT: SYSTEM_PROMPT,
      modelName: "gemini-2.0-flash"
    });

    return response;
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to generate questions",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
