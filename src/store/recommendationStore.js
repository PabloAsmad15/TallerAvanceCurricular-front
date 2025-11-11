import { create } from 'zustand';

export const useRecommendationStore = create((set) => ({
  selectedMalla: null,
  selectedCourses: [],
  currentRecommendation: null,
  history: [],
  
  setSelectedMalla: (malla) => set({ selectedMalla: malla, selectedCourses: [] }),
  
  toggleCourse: (courseId) => set((state) => {
    const isSelected = state.selectedCourses.includes(courseId);
    return {
      selectedCourses: isSelected
        ? state.selectedCourses.filter(id => id !== courseId)
        : [...state.selectedCourses, courseId]
    };
  }),
  
  setSelectedCourses: (courses) => set({ selectedCourses: courses }),
  
  setCurrentRecommendation: (recommendation) => set({ currentRecommendation: recommendation }),
  
  setHistory: (history) => set({ history }),
  
  reset: () => set({
    selectedMalla: null,
    selectedCourses: [],
    currentRecommendation: null,
  }),
}));
