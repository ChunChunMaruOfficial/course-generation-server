const examples = require('./data/examples.json');


function GETmethod(req, res) {
  switch (req.path) {

    case '/getexample':
      res.json({ result: examples })
      break;
  }
}

module.exports = GETmethod