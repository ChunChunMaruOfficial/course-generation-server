const apiKey = process.env.apikey;
const { OpenAI } = require('openai');

const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.perplexity.ai'

});

async function handleGenerate(prompt) {
    const response = await client.chat.completions.create({
        model: 'sonar-pro',
        messages: [{ role: 'user', content: prompt }]
    });
    console.log(response.choices[0].message.content);

    return response.choices[0].message.content

}

module.exports = handleGenerate;