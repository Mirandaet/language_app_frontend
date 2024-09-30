import { create } from "zustand";

const AudioStore = create((set) => ({
  audioURLs: [],
  setAudioURLs: (URLs) => set({ URLs}), 
}));

export default AudioStore;
