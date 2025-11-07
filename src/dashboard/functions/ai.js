import { model } from "../../services/firebase.js";

export async function testAI() {
  const prompt = "Diga 'ok'";
  const { response } = await model.generateContent(prompt);
  return response.text();
}
