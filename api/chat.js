import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message, systemInstruction } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "No message provided" });
    }
    
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable is not set.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const responseText = response.text;

    if (!responseText) {
      return res.status(500).json({ error: "AI returned an empty response." });
    }

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