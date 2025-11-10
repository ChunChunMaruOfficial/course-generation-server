const examples = require('./data/examples.json');

function GETmethod(req, res,courses) {
  switch (req.path) {
    case '/course':
      res.json({ result: courses ?? 'простите , курс еще не сгенерирован' });
      break;
    case '/getexample':      
      res.json({ result: examples })
      break;
  }
}

module.exports = GETmethod