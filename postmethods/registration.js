
const fs = require('fs');
const saltRounds = 12;

const bcrypt = require('bcrypt');

async function registration(req, res) {
    const guestsessions = JSON.parse(fs.readFileSync('data/guestsessions.json', 'utf-8'));
    const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
    if (users.find(v => v.mail == req.body.mail)) {
        return res.status(409).json({ answer: 'пользователь с такой почтой уже есть' })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const date = new Date()
    users.push({ mail: req.body.mail, password: hashedPassword, id: req.body.id, date: date.toLocaleDateString('ru-RU'), courses: guestsessions.find(v => v.id == req.body.id).courses, days: [], tokens: 1000 })
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2), 'utf-8');
    
    return res.status(200).json({ answer: 'Успешная регистрация', user: { id: req.body.id, mail: req.body.mail, date: date, tokens: 1000, courses: guestsessions.find(v => v.id == req.body.id).courses } });
}

module.exports = registration;