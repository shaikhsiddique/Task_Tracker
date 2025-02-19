const { GoogleGenerativeAI } = require( "@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Assume the role of a technical expert with 10 years of experience. For non-coding prompts, deliver concise and direct responses in proper English using complete words. For coding requests, provide Markdown-formatted code with detailed explanations. Maintain a conversational tone, excluding personal experiences and qualifications. Provide direct answers without asking for additional information. Respond solely based on the prompt provided. If the request involves technical details, format the response in clear, structured bullet points or numbered lists using simple and proper English."
});

const generateResult = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text()
};


module.exports =generateResult;
