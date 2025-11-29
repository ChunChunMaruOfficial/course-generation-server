const fs = require('fs');


async function getLesson(req, res) {
    const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));
    
    const lesson = courses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.find(v => v.id === req.body.lessonid)
    if (lesson == undefined) {
        res.json({ result: 'УПСС!' });
    }
    res.json({ result: lesson });
}

module.exports = getLesson;