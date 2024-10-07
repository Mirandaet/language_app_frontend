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
          chat_history: conversationHistory,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const aiResponse = result.response; // Assuming the backend returns {response: "..."}

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
  addUserMessage: (message) => set(state => ({
    conversationHistory: [
      ...state.conversationHistory,
      { role: "USER", content: message }
    ]
  })),
  setConversationHistory: (conversationHistory) => set({ conversationHistory }),
}));

export default GenerateResponseStore;