import dotenv from 'dotenv';
dotenv.config();

import { app } from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌾 KISAN SAATHI BACKEND API SERVER RUNNING`);
    console.log(`   Organization: Team INNOVIX (IIIT Bhagalpur)`);
    console.log(`   Port        : http://localhost:${PORT}`);
    console.log(`   Health API  : http://localhost:${PORT}/api/health`);
    console.log(`   Gemini Key  : ${process.env.GEMINI_API_KEY ? 'Configured ✓' : 'Using ICAR fallback Mode'}`);
    console.log(`====================================================`);
  });
}

startServer();
