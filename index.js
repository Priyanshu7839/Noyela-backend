import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import faceanalysisRoutes from './faceanalysis.route.js'
import "dotenv/config";


const app = express();
app.use(cookieParser());

const corsOptions = {
  origin: [
    'https://www.autotrends.ai',
    'https://autotrends.ai',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));





app.use("/api", faceanalysisRoutes);
const PORT = 8002


app.listen(PORT,()=>{
    console.log(`Server Started at port ${PORT}`);
})
