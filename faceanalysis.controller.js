// controllers/facialAnalysisController.js

import "dotenv/config";
import OpenAI from "openai";
import { MasterPrompt } from "./masterPrompt.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export const analyzeFace = async (req, res) => {
  try {
    // 1. Validate uploaded images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload the three required facial images.",
      });
    }

    if (req.files.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Exactly three facial images are required.",
        received: req.files.length,
      });
    }

    // 2. Prepare all three images for OpenAI
    const imageInputs = req.files.map((file, index) => {
      if (!file.mimetype.startsWith("image/")) {
        throw new Error(`File ${index + 1} is not a valid image.`);
      }

      const base64Image = file.buffer.toString("base64");

      const labels = [
        "Image 1: Front-facing view",
        "Image 2: Left-angled view",
        "Image 3: Right-angled view",
      ];

      return [
        {
          type: "input_text",
          text: labels[index],
        },
        {
          type: "input_image",
          image_url: `data:${file.mimetype};base64,${base64Image}`,
          detail: "high",
        },
      ];
    });

    // 3. Combine the master prompt and all images
    const content = [
      {
        type: "input_text",
        text: MasterPrompt,
      },
      ...imageInputs.flat(),
    ];

    // 4. Send all three images to OpenAI
    const response = await openai.responses.create({
      model: "gpt-5.6",
      input: [
        {
          role: "user",
          content,
        },
      ],
    });

    // 5. Parse the model's JSON response
    const output = response.output_text;

    if (!output) {
      throw new Error("OpenAI returned an empty response.");
    }

    let analysis;

    try {
      analysis = JSON.parse(output);
    } catch {
      console.error("Invalid JSON from OpenAI:", output);
      throw new Error("OpenAI returned an invalid JSON response.");
    }

    // 6. Return the analysis
    if (analysis.status === "error") {
      return res.status(422).json({
        success: false,
        data: analysis,
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis,
    });

  } catch (error) {
    console.error("Facial analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Facial analysis failed.",
      error: error.message,
    });
  }
};

