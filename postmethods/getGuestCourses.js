const fs = require('fs');

function getGuestCourses(req, res) {
    const guestsessions = JSON.parse(fs.readFileSync('data/guestsessions.json', 'utf-8'));
    console.log(req.body.guestId);
    
    console.log(guestsessions.find(v => v.id === req.body.guestId));
    
    res.json({ result: guestsessions.find(v => v.id === req.body.guestId).courses });
}

module.exports = getGuestCourses;