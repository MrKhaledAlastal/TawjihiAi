import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "No message provided" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(message);

    const responseText = result.response.text();

    return res.status(200).json({
      text: responseText,
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Gemini API failed",
      details: error.message,
    });
  }
}
