import { create } from "zustand";
import axios from "axios";

const TtsStore = create((set) => ({
  synthesizeSpeech: async (textToSynthesize, language) => {
    try {
      const formData = new FormData();
      formData.append("text", textToSynthesize);
      formData.append("language", language);
      const response = await axios.post("http://127.0.0.1:8000/tts", formData, {
        responseType: "blob",
      });
      const audioUrl = URL.createObjectURL(response.data);
      return audioUrl;
    } catch (error) {
      console.error("Error synthesizing speech", error);
      return null; // Return null in case of error
    }
  },
}));

export default TtsStore;