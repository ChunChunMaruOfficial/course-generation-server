const express = require('express');
require('dotenv').config();
const cors = require('cors');

const GETmethod = require('./GetMethod.js')
const POSTmethod = require('./PostMethod.js')

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const app = express();
app.use(cors());
app.use(express.json());

// Ваш исходный middleware подход (должен работать)
app.use((req, res) => {
  console.log('Request body:', req.body);
  
  switch (req.method) {
    case "GET":          
      GETmethod(req, res);
      break;
    case "POST":            
      POSTmethod(req, res);
      break;
    default:
      res.status(405).send('Method not allowed');
      break;
  }
});

app.listen(3000, () => {
  console.log(`Server on 3000`);
});