import { create } from "zustand";
import axios from "axios";

const TtsStore = create((set) => ({
  isLoading: false,
  error: null,
  synthesizeSpeech: async (textToSynthesize, language) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("text", textToSynthesize);
      formData.append("language", language);
      const response = await axios.post("http://127.0.0.1:8000/tts", formData, {
        responseType: "blob",
      });
      const audioUrl = URL.createObjectURL(response.data);
      set({ isLoading: false });
      return audioUrl;
    } catch (error) {
      console.error("Error synthesizing speech", error);
      set({ isLoading: false, error: error.message || "Failed to synthesize speech" });
      return null;
    }
  },
}));

export default TtsStore;