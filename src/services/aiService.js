const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const aiService = {
  generateResponse: async (userPrompt, userRole) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Role: ${userRole}. Act as a premium assistant for 'Dining Table' App. 
                     Keep answers concise and helpful. 
                     User Query: ${userPrompt}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "I am unable to process this. Please connect with the Admin.";
      }
    } catch (error) {
      return "Connection error. Please try again or contact Admin.";
    }
  }
};
