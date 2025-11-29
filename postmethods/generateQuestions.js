const prompts = require('../data/shortcourse.json');
const handleGenerate = require('./handleGenerate')
const formatter = require('../formatter')

async function generateQuestions(req, res) {
    let result = await handleGenerate(prompts.questions + req.body.topic);
    const formattext = new formatter(result);
    result = formattext.parse();
    res.json({ result });
}

module.exports = generateQuestions;