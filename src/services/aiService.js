const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * EXECUTIVE AI SERVICE - DINING TABLE PROJECT
 * Operational Context: 20 Locked Markets (Verified from image)
 */
export const aiService = {
  generateResponse: async (userPrompt, userData) => {
    if (!GEMINI_API_KEY) {
      return "Configuration Error: API Key missing.";
    }

    // System instruction strictly based on the 20-country list
    const systemInstruction = `
      Identity: Official Assistant for "Dining Table" App.
      Operational Markets: Thailand, China, Singapore, Turkey, US, UK, UAE, Saudi Arabia, Japan, South Korea, Germany, France, Italy, Canada, Malaysia, Indonesia, Vietnam, Hong Kong, Australia, Switzerland.
      
      Operational Rules:
      1. Role Recognition: Current User is a ${userData?.role || 'Customer'}.
      2. Scope: Only discuss Food Orders, Digital Wallet, and Shop Management within the app.
      3. Language: Detect user input language and respond in the same language.
      4. Privacy: Do not expose internal server paths or financial admin logs.
    `;

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
                  text: `${systemInstruction}\n\nUSER INPUT: ${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 350,
            topP: 0.8,
          },
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        return "System busy. Please contact Admin support.";
      }
    } catch (error) {
      console.error("AI Service Network Error:", error);
      return "Connection failure. Please retry.";
    }
  },
};
