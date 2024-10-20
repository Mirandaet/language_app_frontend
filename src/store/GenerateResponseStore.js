import { create } from "zustand";

const GenerateResponseStore = create((set, get) => ({
  conversationHistory: [],
  responseText: "",
  generateResponse: async (language) => {
    try {
      const conversationHistory = get().conversationHistory;

      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user ID
          conversation_id: 1, // Replace with actual conversation ID
          message: conversationHistory[conversationHistory.length - 1].content,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      let aiResponse = result.response; // Assuming the backend returns {response: "..."}

      // Language-specific responses
      const languageResponses = {
        English: "Okay, I will switch to English.",
        Spanish: "De acuerdo, cambiaré al español.",
        French: "D'accord, je vais passer au français.",
        Chinese: "好的，我会切换到中文。",
        Japanese: "はい、日本語に切り替えます。",
        Korean: "네, 한국어로 전환하겠습니다.",
      };

      if (languageResponses[aiResponse] !== undefined) {
        aiResponse =
          languageResponses[aiResponse] ||
          `Okay, I will switch to ${language}.`;
      }
      set({
        conversationHistory: [
          ...conversationHistory,
          { role: "AI", content: aiResponse },
        ],
        responseText: aiResponse,
      });
    } catch (error) {
      console.error("Error fetching response", error);
    }
  },
  addUserMessage: (message) =>
    set((state) => ({
      conversationHistory: [
        ...state.conversationHistory,
        { role: "USER", content: message },
      ],
    })),
  setConversationHistory: (conversationHistory) => set({ conversationHistory }),
}));

export default GenerateResponseStore;
