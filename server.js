const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();
const cors = require('cors');
const examples = require('./data/examples.json');
const promts = require('./data/promts.json');
const apiKey = process.env.apikey;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let course

const app = express();
app.use(express.json());
app.use(cors());

const handleGenerate = async (req, res, prompt) => {
  console.log("Промт: ", req.body.topic);
  req.body.answers && console.log("Ответы: ", req.body.answers);
  console.log(prompt);

  const response = await client.chat.completions.create({
    model: 'sonar-pro',
    messages: [{ role: 'user', content: prompt + req.body.topic }]
  });

  const result = response.choices[0].message.content;
  course = result;
  res.json({ result });
};

const client = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.perplexity.ai'
});

app.post('/api/generateCourse', (req, res) => {
  handleGenerate(req, res, promts.mainpromt);
});
app.get('/course', (req, res) => {
  console.log('/course');
  
  res.json({ result: course ?? 'простите , курс еще не сгенерирован' });
});

app.post('/api/generateQuestions', (req, res) => {
  handleGenerate(req, res, promts.questionpromt);
});

app.post('/getexample', (_, res) => {
  res.json({ result: examples })
});

app.listen(3000, () => {
  console.log(`Server on 3000`);
});
