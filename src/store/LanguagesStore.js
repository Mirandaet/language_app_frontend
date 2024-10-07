import { create } from "zustand";

const LanguagesStore = create((set) => ({
  languages: [],
  language: "English",
  fetchLanguages: async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/fetch_languages", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      set({ languages: result, language: result[0] });
    } catch (error) {
      console.error("Error fetching languages", error);
      set({ languages: ["English"] }); // Fallback to English if fetch fails
    }
  },
  setLanguage: (language) => set({ language }),
}));

export default LanguagesStore;