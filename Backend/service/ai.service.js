const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);


const generateResult = async (prompt, user) => {
 
  let userContext = "";
  if (user) {
    userContext = `
    \n\nUser Details:
    - Username: ${user.username || "Unknown"}
    - Email: ${user.email || "Not provided"}
    - Phone: ${user.phone || "Not provided"}
    - Workspaces: ${user.workspace && user.workspace.length > 0 ? user.workspace.length : "No workspaces"}
    - Tasks: ${user.tasks && user.tasks.length > 0 ? user.tasks.length : "No tasks assigned"}
    - Notifications: ${user.notifications && user.notifications.length > 0 ? user.notifications.length : "No notifications"}
    `;
  }
  const dynamicSystemInstruction = `Assume the role of a technical expert with 10 years of experience. For non-coding prompts, deliver concise and direct responses in proper English using complete words. For coding requests, provide Markdown-formatted code with detailed explanations. Maintain a conversational tone, excluding personal experiences and qualifications. Provide direct answers without asking for additional information. Respond solely based on the prompt provided. If the request involves technical details, format the response in clear, structured bullet points or numbered lists using simple and proper English.This is some user data use it for chat while giving reply with username and other details as needed  ${userContext}`;
  const dynamicModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: dynamicSystemInstruction
  });
  const result = await dynamicModel.generateContent(prompt);
  return result.response.text();
};

module.exports = generateResult;
