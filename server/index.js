import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const memory = new BufferMemory();
const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.7 });
const chain = new ConversationChain({ llm: model, memory });

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await chain.call({ input: userMessage });
    res.json({ response: response.response });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.listen(port, () => {
  console.log(`LangChain server running on http://localhost:${port}`);
});