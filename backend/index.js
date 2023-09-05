const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

// Initialize OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());

// API endpoint for code conversion
app.post("/api/convert", async (req, res) => {
  try {
    const { code, sourceLanguage, targetLanguage } = req.body;
    const convertedCode = await convertCode(code, sourceLanguage, targetLanguage);
    res.json({ convertedCode });
  } catch (error) {
    console.error("Error converting code:", error.message);
    res.status(500).json({ error: "Error converting code." });
  }
});

// API endpoint for code debugging
app.post("/api/debug", async (req, res) => {
  try {
    const { code } = req.body;
    const debuggedCode = await debugCode(code);
    res.json({ debuggedCode });
  } catch (error) {
    console.error("Error debugging code:", error.message);
    res.status(500).json({ error: "Error debugging code." });
  }
});

// API endpoint for code quality assessment
app.post("/api/quality", async (req, res) => {
  try {
    const { code } = req.body;
    const qualityReport = await assessCodeQuality(code);
    res.json({ qualityReport });
  } catch (error) {
    console.error("Error assessing code quality:", error.message);
    res.status(500).json({ error: "Error assessing code quality." });
  }
});

// Function to convert code using the GPT model
async function convertCode(code, sourceLanguage, targetLanguage) {
  const prompt = `Convert the following ${sourceLanguage} code into ${targetLanguage}:\n\n${code}`;
  const response = await openai.createCompletion({
    engine: "davinci-codex",
    prompt,
    max_tokens: 200,
    temperature: 0.7,
  });
  return response.choices[0].text;
}

// Function to debug code using the GPT model
async function debugCode(code) {
  const prompt = `Debug the following code:\n\n${code}`;
  const response = await openai.createCompletion({
    engine: "davinci-codex",
    prompt,
    max_tokens: 200,
    temperature: 0.7,
  });
  return response.choices[0].text;
}

// Function to assess code quality using the GPT model
async function assessCodeQuality(code) {
  const prompt = `Assess the quality of the following code:\n\n${code}`;
  const response = await openai.createCompletion({
    engine: "davinci-codex",
    prompt,
    max_tokens: 200,
    temperature: 0.7,
  });
  return response.choices[0].text;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
