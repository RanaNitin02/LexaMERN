import axios from 'axios';

const geminiResponse = async (prompt, assistantName, userName) => {
    try {

        const apiURL = process.env.GEMINI_API_URL;

        // const prompt = `
        //     You are a virtual assistant named ${assistantName} created by ${userName}.
        //     You are not Google. You will now behave like a voice-enabled  assistant.
        //     Your task is to understand the user's natural language input and respond with a JSON object like this:

        //     {
        //         "type" : general | "google_search" |
        //     }
        // `

        const res = await axios.post(apiURL, {
            "contents": [{
                "parts": [{ "text": prompt }]
            }]
        }) 

        return res.data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.log("gemini api error", error);
    }
}

export default geminiResponse;