import { z } from "zod";

const Effect = z.object({
  name: z.string(),
  props: z.record(z.string(), z.any()).optional(),
});

const Action = z.object({
  id: z.string(),
  type: z.enum(["video", "image", "audio", "text"]),
  startSec: z.number().min(0),
  durationSec: z.number().positive(),
  props: z.object({
    src: z.string(),
    content: z.string().optional(),
    license: z
      .object({
        source: z.string(),
        author: z.string().optional(),
        url: z.string().optional(),
        license: z.string(),
      })
      .optional(),
  }),
  effects: z.array(Effect).optional(),
});

const Row = z.object({
  id: z.string(),
  kind: z.enum(["video", "image", "audio", "text", "captions"]),
  actions: z.array(Action).min(1),
  transitions: z.array(Effect).optional(),
});

const Scene = z.object({
  id: z.string(),
  title: z.string(),
  durationSec: z.number().positive(),
  rows: z.array(Row).min(1),
});

export const SceneJSONSchema = z.object({
  scenes: z.array(Scene).min(1),
  meta: z.object({
    aspectRatio: z.string().default("16:9"),
    fps: z.number().default(30),
    totalDurationSec: z.number().positive(),
    generator: z.string(),
    version: z.string(),
  }),
});

export type SceneJSON = z.infer<typeof SceneJSONSchema>;
