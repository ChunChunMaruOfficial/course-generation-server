const formatter = require('../formatter')
const prompts = require('../data/shortcourse.json');
const fs = require('fs');
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
const handleGenerate = require('./handleGenerate')

async function generatePractice (req, res) {
    const prompt = prompts.practice.replace('{{topic}}', req.body.topic).replace('{{highlights}}', req.body.highlights).replace('{{previous_practice}}', req.body.previous_practice ?? 'This information can be omitted.')
    const result = await handleGenerate(prompt);
    const formattext = new formatter(result);
    result = formattext.parse();

    if (req.body.userid) {
        users.find(v => v.id === req.body.userid).courses.find(v => v.id === req.body.courseid).module.find(v => v.id === req.body.moduleid).lessons.push(result)
    } else {
        courses.find(v => v.id === req.body.courseid).module.find(v => v.id === req.body.moduleid).lessons.push(result)
    }
    res.json({ result });
}

module.exports = generatePractice;