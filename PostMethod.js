const promts = require('./data/promts.json');
const apiKey = process.env.apikey;
const { OpenAI } = require('openai');

const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.perplexity.ai'
});

const handleGenerate = async (req, res, prompt, courses) => {
    console.log(req.body);
    
    req.body.answers && console.log("Ответы: ", req.body.answers);

    const response = await client.chat.completions.create({
        model: 'sonar-pro',
        messages: [{ role: 'user', content: prompt + req.body.topic }]
    });

    let result = response.choices[0].message.content

    
    
    if (req.path !== '/api/generateexplanation') {
       result = JSON.parse(result.trim().replaceAll('`', '').replace('json', '').trim())
    }
    if (req.path === '/api/generateFastCourse') {
        courses.push(result);
    }
    
    res.json({ result });
};

function POSTmethod(req, res, courses) {    
    switch (req.path) {
        case '/api/generateFastCourse':
            handleGenerate(req, res, promts.fastpromt, courses);
            break;
        case '/api/generateDetailedCourse':
            handleGenerate(req, res, promts.detailpromt, courses);
            break;
        case '/api/generateexplanation':
            handleGenerate(req, res, promts.newwordpromt, courses);
            break;
        case '/api/generateQuestions':
            handleGenerate(req, res, promts.questionpromt, courses);
            break;
    }
}

module.exports = POSTmethod;