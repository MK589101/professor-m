
import { GoogleGenAI, Type } from "@google/genai";
import { CompositionAnalysis } from "../types";

// Always use the API key directly from process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
            title: { type: Type.STRING },
            critique: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "critique", "suggestions"]
        },
        vocabulary: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            critique: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "critique", "suggestions"]
        },
        structure: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            critique: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "critique", "suggestions"]
        },
        logic: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            critique: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "critique", "suggestions"]
        }
      },
      required: ["grammar", "vocabulary", "structure", "logic"]
    },
    revisedVersion: { type: Type.STRING, description: "The full corrected and improved essay." }
  },
  required: ["overallScore", "overallEvaluation", "categories", "revisedVersion"]
};

export async function analyzeComposition(text: string): Promise<CompositionAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Please critique my essay:\n\n${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    // Directly access the text property as per GenerateContentResponse guidelines
    const result = JSON.parse(response.text || '{}');
    return result as CompositionAnalysis;
  } catch (error) {
    console.error("Error analyzing composition:", error);
    throw error;
  }
}
