import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyCxjH2SYKj_s9d7T_za0g71nLPrIHbU60M";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    const models = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`)
      .then(r => r.json());
    console.log(JSON.stringify(models, null, 2));
  } catch (err) {
    console.error("Failed to fetch models", err);
  }
}
run();
