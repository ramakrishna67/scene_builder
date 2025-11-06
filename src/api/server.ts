import Fastify from "fastify";
import dotenv from "dotenv";
import { z } from "zod";
import { generateSceneFromPrompt } from "../providers/gemini"; // ✅ import your rewritten gemini.ts

dotenv.config();

// Initialize Fastify with pretty logger
const app = Fastify({
  logger: {
    level: "info",
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: { colorize: true },
          }
        : undefined,
  },
});

// Zod schema for validating requests
const RequestSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters long"),
  constraints: z.object({
    totalDurationSec: z.number().positive("Duration must be positive"),
    aspectRatio: z.string().optional(),
    fps: z.number().optional(),
    language: z.string().optional(),
    deterministic: z.boolean().optional(),
  }),
});

type RequestInput = z.infer<typeof RequestSchema>;

// Root route (useful for testing)
app.get("/", async (_, reply) => {
  return reply.send({
    message:
      " Scene Builder Agent is running. Use POST /v1/agent/scene to generate scenes.",
  });
});

// Main route: /v1/agent/scene
app.post("/v1/agent/scene", async (req, reply) => {
  try {
    // Validate input
    const { prompt, constraints } = RequestSchema.parse(
      req.body as RequestInput
    );

    // Generate scene JSON from Gemini
    const scene = await generateSceneFromPrompt(prompt, constraints);

    // Send response
    return reply.status(200).send({ scene });
  } catch (err: any) {
    req.log.error(err);

    // Handle validation vs generation errors
    const statusCode =
      err instanceof z.ZodError
        ? 422
        : err.message?.includes("Gemini")
        ? 500
        : 400;

    return reply.status(statusCode).send({
      error: err.message || "Unknown error",
    });
  }
});

//  Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Scene Builder Agent running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
