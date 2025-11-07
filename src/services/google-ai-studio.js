import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_AI_STUDIO,
})

export const model = ai.model({ model: 'gemini-2.5-flash' })
