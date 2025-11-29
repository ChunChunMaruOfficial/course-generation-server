const fs = require('fs');

const bcrypt = require('bcrypt');

async function logincheck(req, res) {
    const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
    console.log(req.body);

    const user = users.find(v => v.mail == req.body.mail)
    if (!user) {
        return res.status(401).json({ answer: 'вы не зарегистрированы' });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ answer: 'пароль неверный' });
    }

    users.find(v => v.mail == req.body.mail).courses = req.body.courses
    return res.status(200).json({ answer: 'Успешный вход', user: { id: user.id, mail: user.mail, date: user.date, tokens: user.tokens, courses: user.courses  } });
}

module.exports = logincheck;