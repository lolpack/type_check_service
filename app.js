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

  // Reject request if input exceeds 2500 characters
  // Can make the wait time too slow and also reduce quality of response
  console.log("code length sent ", code.length)
  // if (code.length > 2500) {
  //   return res.status(400).json({ error: "Input too long. Code must not exceed 2500 characters." });
  // }

  try {
    const prompt = `You are an AI that converts untyped Python code to fully typed Python code using type hints. Given the following Python function, infer and add type annotations. Make sure to import anything needed from the typing module:\n\n### Code:\n${code}\n\n### Typed Code:\n`;

    res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Transfer-Encoding', 'chunked'); // Enables streaming response

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,  // Increased token limit
      temperature: 0.2,
      // stream: true,  // Enables streaming from OpenAI
    });

    //maybe stream later for real time updates and better UI

    // res.write('{"typedCode": "');

    // for await (const chunk of stream) {
    //   res.write(chunk.choices[0].delta?.content || '');
    // }

    // res.end('"}');

    
    // Extract response content
    let typedCode = response.choices[0].message.content.trim();

    // Remove leading and trailing triple backticks (including ```python and ```)
    typedCode = typedCode.replace(/^```python\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    res.json({ typedCode });
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
    const prompt = `You are an AI that returns well typed Python code. Given the following code, identify type issues and explain how to fix them. Even if it's not a runtime error, consider a type error that is present to be an error. 'reveal_type' is useful for debugging type checkers so do not mention it in your response unless you are suggesting to use it.\n\n### Code:\n${code}\n### Type Error:\n${typeError}\n\n\n\n### Typed Code:\n`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500, 
      temperature: 0.3,
    });

    const gptResponse = response.choices[0].message.content.trim()
    const typedCode = gptResponse.replace(/^```python\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    res.json({ explanation: typedCode });
  } catch (error) {
    console.error("Error processing explain-error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/fix-types', async (req, res) => {
  const { code, typeError } = req.body;
  console.log(new Date(), 'fix-types request received');

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  if (!typeError) {
    return res.status(400).json({ error: "No typeError provided" });
  }

  try {
    const prompt = `You are a helpful AI and help fix type errors in Python code. Given the following Python code and type error, infer and fix the type error. Return only the corrected Python code without any explanations, comments, or formatting hints.

### Code:
${code}

### Type Error:
${typeError}

### Fixed Code:
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500, 
      temperature: 0.3,
    });

    res.json({ code: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error processing explain-error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
