const saltRounds = 12;
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
const bcrypt = require('bcrypt');

async function registration(req, res) {
    if (users.find(v => v.email == req.body.email)) {
        return res.status(409).json({ answer: 'пользователь с такой почтой уже есть' })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const id = Date.now()
    users.push({ email: req.body.email, password: hashedPassword, id: id, date: Date().toLocaleDateString('ru-RU'), courses: courses, days: [] })
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2), 'utf-8');
    return res.status(200).json({ answer: 'Успешная регистрация', user: { id: id, email: req.body.email } });
}

module.exports = registration;