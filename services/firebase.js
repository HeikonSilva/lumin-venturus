import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-ai.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwR8hqqQIH-_aCodqWdH601wPj0PcRIHk",
  authDomain: "lumin-4cf31.firebaseapp.com",
  projectId: "lumin-4cf31",
  storageBucket: "lumin-4cf31.firebasestorage.app",
  messagingSenderId: "104923062444",
  appId: "1:104923062444:web:99bb84452475415bdd3f09",
  measurementId: "G-QVG7HH519C",
  databaseURL: "https://lumin-4cf31-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Use the initialized app to get the AI backend
const ai = getAI(app, { backend: new GoogleAIBackend() });
// Keep a fast, low-cost model for UI interactions
const model = getGenerativeModel(ai, { model: "gemini-2.0-flash" });

export { model };
