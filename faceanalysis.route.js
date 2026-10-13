// routes/facialAnalysisRoutes.js

import express from "express";
import multer from "multer";

import { analyzeFace } from "./faceanalysis.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

router.post(
  "/analyze",
  upload.array("images", 3),
  analyzeFace
);

export default router;