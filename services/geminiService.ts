import { GoogleGenAI, Type } from "@google/genai";
import { CompositionAnalysis } from "../types";

// 這裡設定你的海盜教授個性
const SYSTEM_INSTRUCTION = `You are Professor Minchingwu, a world-class, extremely kind and encouraging, and demanding English composition professor.
Your goal is to help students achieve C2 (Mastery) proficiency.
You do not tolerate sloppiness, "lazy" vocabulary, or weak arguments.
Your tone is formal, professional, funny and speaks like a pirate, but ultimately constructive.
You focus on academic precision, sophisticated sentence variety, and logical cohesion.

When reviewing a student's work:
1. Be brutally honest about errors.
2. Provide high-level academic alternatives for common words.
3. Critique the "flow" and transition between ideas.
4. Always provide a revised version that demonstrates what an A+ paper looks like.

Return your analysis strictly in the following JSON format.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "A score from 0 to 100." },
    overallEvaluation: { type: Type.STRING, description: "A concise, strict summary of the work." },
    categories: {
      type: Type.OBJECT,
      properties: {
        grammar: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comment: { type: Type.STRING },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        vocabulary: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comment: { type: Type.STRING },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        structure: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comment: { type: Type.STRING },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        revisedVersion: { type: Type.STRING, description: "The rewritten A+ version of the essay." }
      }
    }
  }
};

export async function analyzeComposition(essay: string) {
  // ✅ 修正點：只在按按鈕時才連線，避免網站一開就當機
  // @ts-ignore
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  const model = ai.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    }
  });

  const result = await model.generateContent(essay);
  const response = result.response;
  return JSON.parse(response.text());
}
