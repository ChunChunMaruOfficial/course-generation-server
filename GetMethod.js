const examples = require('./data/examples.json');
const fs = require('fs');
const courses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));


function GETmethod(req, res) {
  switch (req.path) {
    case '/course':
      console.log(courses.length);

      res.json({ result: courses ?? 'простите , курс еще не сгенерирован' });
      break;
    case '/getexample':
      res.json({ result: examples })
      break;
  }
}

module.exports = GETmethod