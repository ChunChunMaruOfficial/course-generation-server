const prompts = require('../data/shortcourse.json');
const handleGenerate = require('./handleGenerate')
const fs = require('fs');

async function generateExplanation(req, res) {
    const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
    let guestsessions = JSON.parse(fs.readFileSync('data/guestsessions.json', 'utf-8'));

    console.log(req.body);
    const result = await handleGenerate(prompts.newwordpromt.replace('{{topic}}', req.body.topic).replace('{{context}}', req.body.context));

    if (req.body.userid) {
        users.find(v => v.id === req.body.userid).cuorses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.find(v => v.id === req.body.lessonid).selectedwords.push({ word: req.body.topic, explanation: result })
    }
    else {
        guestsessions.find(v => v.id === req.body.guestId).courses.find(v => v.id === req.body.courseid).modules.find(v => v.id === req.body.moduleid).lessons.find(v => v.id === req.body.lessonid).selectedwords.push({ word: req.body.topic, explanation: result })
        fs.writeFileSync('data/guestsessions.json', JSON.stringify(guestsessions, null, 2), 'utf-8');
    }
     
    res.json({ explanation: result });
}

module.exports = generateExplanation;