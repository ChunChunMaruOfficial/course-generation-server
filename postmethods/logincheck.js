const fs = require('fs');
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
const bcrypt = require('bcrypt');

async function logincheck(req, res) {
    console.log(req.body);

    const user = users.find(v => v.email == req.body.email)
    if (!user) {
        return res.status(401).json({ answer: 'вы не зарегистрированы' });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ answer: 'пароль неверный' });
    }
    return res.status(200).json({ answer: 'Успешный вход', user: { id: user.id, email: user.email } });
}

module.exports = logincheck;