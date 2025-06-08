import axios from 'axios';

const geminiResponse = async (command, assistantName, userName) => {
    try {

        const apiURL = process.env.GEMINI_API_URL;

        const prompt = `
            You are a virtual assistant named ${assistantName} created by ${userName}.
            You are not Google. You will now behave like a voice-enabled  assistant.
            Your task is to understand the user's natural language input and respond with a JSON object like this:

            {
                "type" : general | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facbook-open" | "weather-show",
                "userInput": "<original user input>" {only remove your name from userinput if exists} and agr kisi ne google ya youtube pr kuch search karne ko bola hai toh userinput me only wo search wala text jaaye,
                "response" : <a short spoken response to read out loud to the user>"   
            }

            Instructions: 
                - "type": determine the intent of user.
                - "userInput": original sentence the user spoke.
                - "response": A short voice-friendly reply, e.g., "sure, playing it now", "Here's what i found", "Today is Tuesday", etc.

            Type meanings:
                - "general": if it is factual or informational question.
                - "google_search": if the user wants to search something on Google.
                - "youtube_search": if the user wants to search something on YouTube.
                - "youtube_play": if the user wants to play a YouTube video or song.
                - "calculator_open": if the user wants to open the calculator.
                - "instagram-open": if the user wants to open Instagram.
                - "facebook_open": if the user wants to open Facebook.
                - "weather_show": if the user wants to know the weather.
                - "get_time": if the user asks for the current time.
                - "get_date": if the user asks for the current date.
                - "get_day": if the user asks for the current day.
                - "get_month": if the user asks for the current month.

            Important:
             - Use ${userName} agar koi puche tumne kise banaya hai
             - Only response with the JSON onject, nothing else.

            now your userInput - ${command} 
        `

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