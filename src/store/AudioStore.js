import { create } from "zustand";

const AudioStore = create((set) => ({
  audioURLs: [],
  addAudioURL: (url) => set((state) => ({ audioURLs: [...state.audioURLs, url] })),
  clearAudioURLs: () => set({ audioURLs: [] }),
}));

export default AudioStore;