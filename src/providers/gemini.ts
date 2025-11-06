import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in .env file");
}

/**
 * Generate structured scene JSON from a natural-language prompt.
 * Works with AI Studio or Google Cloud Gemini keys.
 */
export async function generateSceneFromPrompt(
  userPrompt: string,
  constraints: {
    totalDurationSec: number;
    aspectRatio?: string;
    fps?: number;
    language?: string;
    deterministic?: boolean;
  }
) {
  // 👉 Use the working Gemini v1 model endpoint
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  const systemPrompt = `
You are a Scene Builder Agent.
Given a natural-language description, generate a JSON object that defines
a sequence of scenes for a video editor.

Follow these rules strictly:
- Output ONLY JSON — no explanations or markdown.
- Sum of scene durations must equal meta.totalDurationSec.
- Each scene must include at least one 'video' or 'image' row.
- Add optional 'text' or 'audio' rows where appropriate.
- Use descriptive placeholders if real URLs are not available.
- Add 'license' info for all media items.
- Each scene should include at least one subtle 'effect' object.
- The response must match the structure shown below.
`;

  const exampleStructure = {
    scenes: [
      {
        id: "scene-1",
        title: "Sample Title",
        durationSec: 5,
        rows: [
          {
            id: "row-1",
            kind: "video",
            actions: [
              {
                id: "action-1",
                type: "video",
                startSec: 0,
                durationSec: 5,
                props: {
                  src: "placeholder: example video",
                  license: { source: "pexels", license: "free" },
                },
                effects: [{ name: "fadeIn", props: { durationSec: 0.5 } }],
              },
            ],
          },
        ],
      },
    ],
    meta: {
      aspectRatio: "16:9",
      fps: 30,
      totalDurationSec: 5,
      generator: "scene-builder-agent",
      version: "1.0.0",
    },
  };

  const composedPrompt = `
${systemPrompt}

User prompt:
${userPrompt}

Constraints:
${JSON.stringify(constraints, null, 2)}

Output must strictly follow this JSON schema:
${JSON.stringify(exampleStructure, null, 2)}
`;

  try {
    // ✅ Call the Gemini v1 REST API
    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: composedPrompt }],
          },
        ],
        generationConfig: {
          temperature: constraints.deterministic ? 0 : 0.6,
          // maxOutputTokens: 2048,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    // ✅ Extract text safely
    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    // ✅ Try to parse JSON output
    try {
      const parsed = JSON.parse(cleanedText);
      return parsed;
    } catch {
      console.warn("⚠️ Gemini returned non-strict JSON, returning raw text.");
      return { raw: cleanedText };
    }
  } catch (error: any) {
    const detail = error.response?.data || error.message;
    console.error("❌ Gemini API Error:", detail);
    throw new Error(
      `[Gemini Error]: ${
        detail.error?.message || JSON.stringify(detail, null, 2)
      }`
    );
  }
}
