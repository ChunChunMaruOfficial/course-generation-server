const formatter = require('../formatter')
const prompts = require('../data/shortcourse.json');
const fs = require('fs');
const handleGenerate = require('./handleGenerate')

async function generatePractice(req, res) {
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));

    const prompt = prompts.practice.replace('{{topic}}', req.body.topic).replace('{{highlights}}', req.body.highlights).replace('{{previous_practice}}', req.body.previous_practice ?? 'This information can be omitted.')
    let result = await handleGenerate(prompt);
    const formattext = new formatter(result);
    result = formattext.parse();

    if (req.body.userid) {
        //ПОД ЗАМЕНУ!!!!!!
        users.find(v => v.id === req.body.userid).courses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.push(result)
    } else {
        //  courses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.push(result)
        const course = courses.find(v => v.id === req.body.courseid);
        const module = course?.modules.find(v => v.id === req.body.moduleid);
        const lesson = module?.lessons.find(v => v.id === req.body.lessonid);

        if (lesson) {
            lesson.practice = result.questions;
            fs.writeFileSync('data/courses.json', JSON.stringify(courses, null, 2), 'utf-8');
        }
    }
    res.json({ result });
}

module.exports = generatePractice;