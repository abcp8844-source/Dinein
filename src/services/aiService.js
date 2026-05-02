const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * EXECUTIVE AI SERVICE - DINING TABLE PROJECT
 * Operational Context: 20 Locked Markets
 */
export const aiService = {
  generateResponse: async (userPrompt, systemContext) => {
    if (!GEMINI_API_KEY) {
      return "Critical Error: API Key missing in environment.";
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemContext}\n\nUSER INPUT: ${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250, // Slightly increased for clarity
            topP: 0.9,
          },
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        return "Service unavailable. Please reach out to Admin support.";
      }
    } catch (error) {
      return "Network interruption. Please verify connectivity and retry.";
    }
  },
};
