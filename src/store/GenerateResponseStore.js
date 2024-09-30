import { create } from "zustand";

const GenerateResponseStore = create((set, get) => ({
  conversationHistory: [],
  responseText: "",
  generateResponse: async (language) => {
    try {
      // Access the conversationHistory state using get()
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

      const result = await response.json();
      set({
        conversationHistory: [
          ...conversationHistory,
          { role: "AI", message: result },
        ],
        responseText: result, // Combine setting both states into one set call
      });
    } catch (error) {
      console.error("Error fetching response", error);
    }
  },
  setConversationHistory: (conversationHistory) => set({ conversationHistory }),
}));

export default GenerateResponseStore;
