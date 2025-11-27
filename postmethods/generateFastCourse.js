const formatter = require('../formatter')
const prompts = require('../data/shortcourse.json');
const fs = require('fs');
const handleGenerate = require('./handleGenerate')
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));

async function generateFastCourse(req, res) {
    let result = await handleGenerate(prompts.course.replace('{{topic}}', req.body.topic) + req.body.answers + ". " + req.body.notes);
    if (result.includes('УПСС!')){
        res.json({ result });
        return 0
    }
    const formattext = new formatter(result);
    result = formattext.parse();
    result.id = Date.now()
    if (req.body.userid) {
        users.find(v => v.id === req.body.userid).courses.push(result)
    } else {
        courses.push(result);
    }
    fs.writeFileSync('data/courses.json', JSON.stringify(courses, null, 2), 'utf-8');
    res.json({ result });
}

module.exports = generateFastCourse;