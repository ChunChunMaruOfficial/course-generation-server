const promts = require('./data/shortcourse.json');
const apiKey = process.env.apikey;
const { OpenAI } = require('openai');
const fs = require('fs');
const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf-8'));
const registration = require('./postmethods/registration')
const logincheck = require('./postmethods/logincheck')

const formatter = require('./formatter')


const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.perplexity.ai'

});

const handleGenerate = async (req, res, prompt) => {
    const response = await client.chat.completions.create({
        model: 'sonar-pro',
        messages: [{ role: 'user', content: prompt }]
    });

    return response.choices[0].message.content

}

const generateFastCourse = async (req, res) => {
    const result = await handleGenerate(req, res, promts.course.replace('{{topic}}')) + req.body.answers;
    const formattext = new formatter(result);
    result = formattext.parse();
    result.id = Date.now()
    courses.push(result);
    fs.writeFileSync('data/courses.json', JSON.stringify(courses, null, 2), 'utf-8');
    res.json({ result });
}

const generateExplanation = async (req, res) => {
    const result = await handleGenerate(req, res, promts.newwordpromt + req.body.topic);
    const course = courses.find(v => v.id === req.body.courseid)
    const module = course.module.find(v => v.id === req.body.moduleid)
    const lesson = module.lessons.find(v => v.id === req.body.lessonid)
    lesson.explanations.push(result)
    res.json({ result });
}

const generateQuestions = async (req, res) => {
    const result = await handleGenerate(req, res, promts.questions + req.body.topic);
    res.json({ result });
}

const handleGenerate = async (req, res, prompt) => {
    console.log(req.body);

    if (req.path !== '/api/generateLesson' && req.path !== '/api/generatePractice') {
        prompt = prompt + req.body.topic
    }

    if (req.path === '/api/generatePractice') {
        prompt = prompt.replace('{{topic}}', req.body.topic).replace('{{highlights}}', req.body.highlights).replace('{{previous_practice}}', req.body.previous_practice ?? 'This information can be omitted.')
    }

    if (req.path === '/api/generateLesson') {
        prompt = prompt.replace('{{lesson_name}}', req.body.topic).replace('{{course_structure}}', req.body.course_structure).replace('{{context}}', req.body.context ?? 'This information can be omitted.')
    }

    if (req.path !== '/api/generateexplanation') {

    }
};

function POSTmethod(req, res, courses) {
    switch (req.path) {
        case '/api/generateFastCourse':
            generateFastCourse(req, res)
            break;
        // case '/api/generateDetailedCourse':
        //     handleGenerate(req, res, promts.detailpromt, courses);
        //     break;
        case '/api/generateExplanation':
            generateExplanation(req, res);
            break;
        case '/api/generateQuestions':
            handleGenerate(req, res, promts., courses);
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