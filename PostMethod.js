const promts = require('./data/shortcourse.json');
const apiKey = process.env.apikey;
const { OpenAI } = require('openai');
const fs = require('fs');
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
const bcrypt = require('bcrypt');
const saltRounds = 12;



const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.perplexity.ai'
});

const handleGenerate = async (req, res, prompt) => {
    console.log(req.body);

    req.body.answers && console.log("Ответы: ", req.body.answers);

    const response = await client.chat.completions.create({
        model: 'sonar-pro',
        messages: [{ role: 'user', content: prompt + req.body.topic }]
    });

    let result = response.choices[0].message.content

    console.log(result);

    if (req.path !== '/api/generateexplanation') {
        result = JSON.parse(result.trim().replaceAll('`', '').replace('json', '').trim())
    }
    if (req.path === '/api/generateFastCourse') {
        courses.push(result);
        fs.writeFileSync('data/courses.json', JSON.stringify(courses, null, 2), 'utf-8');
    }

    res.json({ result });
};


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

async function registration(req, res) {
    if (users.find(v => v.email == req.body.email)) {
        return res.status(409).json({ answer: 'пользователь с такой почтой уже есть' })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const id = Date.now()
    users.push({ email: req.body.email, password: hashedPassword, id: id, date: Date().toLocaleDateString('ru-RU') })
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2), 'utf-8');
    return res.status(200).json({ answer: 'Успешная регистрация', user: { id: id, email: req.body.email } });
}

function POSTmethod(req, res, courses) {
    switch (req.path) {
        case '/api/generateFastCourse':
            handleGenerate(req, res, promts.course, courses);
            break;
        // case '/api/generateDetailedCourse':
        //     handleGenerate(req, res, promts.detailpromt, courses);
        //     break;
        case '/api/generateexplanation':
            handleGenerate(req, res, promts.newwordpromt, courses);
            break;
        case '/api/generateQuestions':
            handleGenerate(req, res, promts.questions, courses);
            break;
        case '/api/generateLesson':
            handleGenerate(req, res, promts.lesson, courses);
            break;
        case '/api/generatePractice':
            handleGenerate(req, res, promts.practice, courses);
            break;
        case '/login':
            logincheck(req, res)
            break;
        case '/registration':
            registration(req, res)
            break;
    }
}

module.exports = POSTmethod;