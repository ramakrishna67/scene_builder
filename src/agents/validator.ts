import { SceneJSONSchema, SceneJSON } from "../core/schema";

export function validateSceneJSON(data: unknown): SceneJSON {
  return SceneJSONSchema.parse(data);
}
