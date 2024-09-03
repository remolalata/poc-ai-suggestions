import axios from "axios";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_ENDPOINT = process.env.REACT_APP_OPENAI_ENDPOINT;

const generateChatResponse = async ({
    messages,
    maxTokens = 250,
    temperature = 0.7,
    topP = 1.0
} = {}) => {

    try {
        const response = await axios.post(
            `${OPENAI_ENDPOINT}`,
            {
                messages: messages,
                max_tokens: Number(maxTokens),
                temperature: parseFloat(temperature),
                top_p: parseFloat(topP),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": OPENAI_API_KEY,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error generating chat response:", error);
        throw error;
    }
};

export default generateChatResponse;
