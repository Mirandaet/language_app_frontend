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
        console.log("Fail");
        throw new Error("Failed to fetch languages");
      }
      const result = await response.json();
      set({ languages: result });
      set({language: result[0]});
    } catch (error) {
      console.error("Error fetching languages", error);
    }
  },
  setLanguage: (language) => set({ language}), 
}));

export default LanguagesStore;
