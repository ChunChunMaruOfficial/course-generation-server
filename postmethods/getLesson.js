const fs = require('fs');
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));

async function getLesson(req, res) {
    const lesson = courses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.find(v => v.id === req.body.lessonid)
    if (lesson == undefined) {
        res.json({ result: 'УПСС!' });
    }
    res.json({ result: lesson });
}

module.exports = getLesson;