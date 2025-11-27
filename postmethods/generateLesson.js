const formatter = require('../formatter')
const prompts = require('../data/shortcourse.json');
const handleGenerate = require('./handleGenerate')
const fs = require('fs');
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));



async function generateLesson (req, res) {
    const prompt = prompts.lesson.replace('{{lesson_name}}', req.body.topic).replace('{{course_structure}}', req.body.course_structure).replace('{{context}}', req.body.context ?? 'This information can be omitted.')
    let result = await handleGenerate(prompt);
    const formattext = new formatter(result);
    result = formattext.parse();
    if (req.body.userid) {
        users.find(v => v.id === req.body.userid).courses.find(v => v.id === req.body.courseid).module.find(v => v.id === req.body.moduleid).lessons.push(result)
    } else {
        courses.find(v => v.id === req.body.courseid).module.find(v => v.id === req.body.moduleid).lessons.push(result)
    }
    res.json({ result });
}

module.exports = generateLesson;