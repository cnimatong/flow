import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useIntroStore = create((set) => ({
  hasSeenIntro: false,
  isLoading: true,

  // Initialize the store by loading from AsyncStorage
  initialize: async () => {
    const value = await AsyncStorage.getItem('hasSeenIntro');
    set({
      hasSeenIntro: value === 'true',
      isLoading: false,
    });
  },

  // Mark intro as seen and save to AsyncStorage
  markIntroSeen: async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    set({ hasSeenIntro: true });
  },

  // Reset intro state
  resetIntroState: async () => {
    await AsyncStorage.removeItem('hasSeenIntro');
    set({ hasSeenIntro: false });
  },
}));
