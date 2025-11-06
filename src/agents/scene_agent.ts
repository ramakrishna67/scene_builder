import { generateSceneFromPrompt } from "../providers/gemini";
import { validateSceneJSON } from "../agents/validator";
import type { SceneJSON } from "../core/schema";

export async function buildScene(
  prompt: string,
  constraints: {
    totalDurationSec: number;
    aspectRatio?: string;
    fps?: number;
    language?: string;
    deterministic?: boolean;
  }
): Promise<SceneJSON> {
  try {
    const raw = await generateSceneFromPrompt(prompt, constraints);

    const validated = validateSceneJSON(raw);

    return validated;
  } catch (err: any) {
    console.error(" buildScene error:", err.message);
    throw new Error(
      `Scene generation failed: ${err.message || "Unknown error"}`
    );
  }
}
