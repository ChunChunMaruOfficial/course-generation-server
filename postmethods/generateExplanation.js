const prompts = require('../data/shortcourse.json');
const handleGenerate = require('./handleGenerate')
const fs = require('fs');
let courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));

async function generateExplanation  (req, res) {
    const result = await handleGenerate(prompts.newwordpromt + req.body.topic);
    
    lesson.explanations.push(result)
     if (req.body.userid) {
        //ПОД ЗАМЕНУ!!!!!!
            users.find(v => v.id === req.body.userid).courses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.push(result)
        } else {
            //  courses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.push(result)
            const course = courses.find(v => v.id === req.body.courseid);
            const module = course?.modules.find(v => v.id === req.body.moduleid);
            const lesson = module?.lessons.find(v => v.id === req.body.lessonid);
    
            if (lesson) {
                lesson.selectedwords = result;
                fs.writeFileSync('data/courses.json', JSON.stringify(courses, null, 2), 'utf-8');
            }
        }
    res.json({ result });
}

module.exports = generateExplanation;