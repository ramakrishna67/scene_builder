import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: "Say hello from Gemini in JSON format" }],
        },
      ],
      generationConfig: { responseMimeType: "application/json" },
    });

    console.log(" Gemini responded with:");
    console.log(result.response.text());
  } catch (error: any) {
    console.error(" Gemini API error:", error.message);
  }
}

testGemini();
