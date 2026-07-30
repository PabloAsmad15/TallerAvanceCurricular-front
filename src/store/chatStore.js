import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  messages: [],
  isReportUploaded: false,
  hasSentFirstEmail: false,
  isLoading: false,

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setReportUploaded: (value) => {
    set({ isReportUploaded: value });
  },

  setHasSentFirstEmail: (value) => {
    set({ hasSentFirstEmail: value });
  },

  setIsLoading: (value) => {
    set({ isLoading: value });
  },

  clearChat: () => {
    set({
      messages: [],
      isReportUploaded: false,
      hasSentFirstEmail: false,
      isLoading: false,
    });
  },
}));

export default useChatStore;