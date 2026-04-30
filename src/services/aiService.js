const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const aiService = {
  /**
   * Universal AI Service for Dining Table App
   * Handles both Owner & Customer logic via systemContext
   */
  generateResponse: async (userPrompt, systemContext) => {
    if (!GEMINI_API_KEY) {
      return "System Error: API Key missing.";
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemContext}\n\nUser Query: ${userPrompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "I am unable to process this request. Please contact Admin support.";
      }
    } catch (error) {
      return "Connection interrupted. Please check your network and retry.";
    }
  },
};
