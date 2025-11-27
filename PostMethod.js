const registration = require('./postmethods/registration')
const logincheck = require('./postmethods/logincheck')
const generateExplanation = require('./postmethods/generateExplanation')
const generateFastCourse = require('./postmethods/generateFastCourse')
const generateLesson = require('./postmethods/generateLesson')
const generatePractice = require('./postmethods/generatePractice')
const generateQuestions = require('./postmethods/generateQuestions')
const getLesson = require('./postmethods/getLesson')

function POSTmethod(req, res) {
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
        case '/api/getLesson':
            getLesson(req, res);
            break;
        case '/api/generateQuestions':
            generateQuestions(req, res);
            break;
        case '/api/generateLesson':
            generateLesson(req, res);
            break;
        case '/api/generatePractice':
            generatePractice(req, res);
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