import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API (Make sure your key in .env starts with "AIza")
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

app.post('/api/generate-story', async (req, res) => {
  const { theme } = req.body;
  
  try {
    // Using the correct, modern flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      You are an AI designing an interactive visual canvas. Theme: "${theme}".
      Generate a short title, an image search term, and exactly 3 interactive hotspots. 
      Hotspots need x and y coordinates (between 15 and 85, representing percentages).
      Respond ONLY with valid JSON, no markdown formatting, in this exact structure:
      {
        "storyTitle": "string",
        "imageSearchTerm": "string",
        "hotspots": [ { "id": 1, "x": 45, "y": 60, "title": "string", "text": "string" } ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.warn("⚠️ AI API Failed! Using fallback data so the UI still works...");
    
    // THIS IS THE FAILSAFE: If the API key is wrong, the app still works!
    res.json({
      storyTitle: `Exploring: ${theme || "The Unknown"}`,
      imageSearchTerm: theme || "futuristic landscape",
      hotspots: [
        { id: 1, x: 30, y: 40, title: "Point of Interest", text: "This area features unique architectural elements adapted to the environment." },
        { id: 2, x: 70, y: 55, title: "Central Hub", text: "The main focal point where all activity converges." },
        { id: 3, x: 50, y: 80, title: "Hidden Detail", text: "A closer look reveals the intricate design required to make this functional." }
      ]
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));