require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/add-types', async (req, res) => {
  const { code } = req.body;
  console.log(new Date(), 'add-types request received');

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const prompt = `You are an AI that converts untyped Python code to fully typed Python code using type hints. Given the following Python function, infer and add type annotations:\n\n### Code:\n${code}\n\n### Typed Code:\n`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.2,
    });

    res.json({ typedCode: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error processing add-types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/explain-error', async (req, res) => {
  const { code, typeError } = req.body;
  console.log(new Date(), 'explain-error request received');

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  if (!typeError) {
    return res.status(400).json({ error: "No typeError provided" });
  }

  try {
    const prompt = `You are a helpful AI and give high quality answers to developers to debug type errors in Python. Given the following code, identify type issues and explain how to fix them. Even if it's not a runtime error, consider a type error that is present to be an error. 'reveal_type' is useful for debugging type checkers so do not mention it in your response unless you are suggesting to use it.\n\n### Code:\n${code}\n### Type Error:\n${typeError}\n\n### Explanation:\n`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.3,
    });

    res.json({ explanation: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error processing explain-error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
