const prompts = require('../data/shortcourse.json');
const handleGenerate = require('./handleGenerate')


async function generateExplanation  (req, res) {
    const result = await handleGenerate(prompts.newwordpromt + req.body.topic);
    const course = courses.find(v => v.id === req.body.courseid)
    const module = course.modules.find(v => v.id === req.body.moduleid)
    const lesson = module.lessons.find(v => v.id === req.body.lessonid)
    lesson.explanations.push(result)
    res.json({ result });
}

module.exports = generateExplanation;