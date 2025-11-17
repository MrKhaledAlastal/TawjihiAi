

import { GoogleGenAI, Chat, Tool } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const createChatSession = (systemInstruction: string, tools?: Tool[]): Chat => {
  const config: { systemInstruction: string; temperature: number; topP: number; topK: number; tools?: Tool[] } = {
    systemInstruction: systemInstruction,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
  };

  if (tools) {
    config.tools = tools;
  }
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: config,
  });
  return chat;
};