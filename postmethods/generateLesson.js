const formatter = require('../formatter')
const prompts = require('../data/shortcourse.json');
const handleGenerate = require('./handleGenerate')
const fs = require('fs');
let courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));



async function generateLesson(req, res) {
    const prompt = prompts.lesson.replace('{{lesson_name}}', req.body.topic).replace('{{course_structure}}', req.body.course_structure).replace('{{context}}', req.body.context ?? 'This information can be omitted.')
    let result = await handleGenerate(prompt);
    const formattext = new formatter(result);
    result = formattext.parse();
    if (req.body.userid) {
        users.find(v => v.id === req.body.userid).courses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.find(v => v.id === req.body.lessonid).content = result.lesson_text
    } else {
        const course = courses.find(v => v.id === req.body.courseid);
        const module = course?.modules.find(v => v.id === req.body.moduleid);
        const lesson = module?.lessons.find(v => v.id === req.body.lessonid);

        if (lesson) {
            lesson.content = result.lesson_text;
            lesson.links = result.links;
            fs.writeFileSync('data/courses.json', JSON.stringify(courses, null, 2), 'utf-8');
        }

    }
    res.json({ result });
}

module.exports = generateLesson;