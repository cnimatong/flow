import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { persist, createJSONStorage } from 'zustand/middleware';

const useQuestStore = create(
  persist(
    (set, get) => ({
      quests: [],
      questCount: 0,
      dailyMissionProgress: 0,
      weeklyMissionProgress: 0,
      lastQuestDate: null,
      streak: 0,
      achievements: {},
      totalQuestsCompleted: 0,
      dailyMissionsCompleted: 0,
      weeklyMissionsCompleted: 0,
      lastDailyReset: null,
      lastWeeklyReset: null,
      isLoading: true,

      // Consolidated load quests and achievements function
      loadQuestsAndAchievements: async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        let loadedData = {
          quests: [],
          achievements: {},
          lastQuestDate: null,
          streak: 0,
          dailyMissionProgress: 0,
          weeklyMissionProgress: 0,
          totalQuestsCompleted: 0,
          dailyMissionsCompleted: 0,
          weeklyMissionsCompleted: 0,
          experience: 0,
          lastDailyReset: new Date().toLocaleDateString('en-CA'),
          lastWeeklyReset: new Date().toLocaleDateString('en-CA'),
        };

        set({ isLoading: true });
        try {
          if (user) {
            // Load from Firestore if user is signed in
            const userDoc = await firestore().collection('users').doc(user.uid).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              loadedData = {
                quests: userData.quests || [],
                achievements: userData.achievements || {},
                lastQuestDate: userData.lastQuestDate ? new Date(userData.lastQuestDate) : null,
                streak: userData.streak || 0,
                dailyMissionProgress: userData.dailyMissionProgress ?? 0,
                weeklyMissionProgress: userData.weeklyMissionProgress ?? 0,
                totalQuestsCompleted: userData.totalQuestsCompleted || 0,
                dailyMissionsCompleted: userData.dailyMissionsCompleted || 0,
                weeklyMissionsCompleted: userData.weeklyMissionsCompleted || 0,
                experience: userData.experience || 0,
                lastDailyReset: userData.lastDailyReset || new Date().toLocaleDateString('en-CA'),
                lastWeeklyReset: userData.lastWeeklyReset || new Date().toLocaleDateString('en-CA'),
              };
            }
          } else {
            // Load from AsyncStorage if user is not signed in (guest)
            const quests = await AsyncStorage.getItem('quests');
            const achievements = await AsyncStorage.getItem('achievements');
            const lastQuestDate = await AsyncStorage.getItem('lastQuestDate');
            const streak = await AsyncStorage.getItem('streak');
            const dailyMissionProgress = await AsyncStorage.getItem('dailyMissionProgress');
            const weeklyMissionProgress = await AsyncStorage.getItem('weeklyMissionProgress');
            const totalQuestsCompleted = await AsyncStorage.getItem('totalQuestsCompleted');
            const dailyMissionsCompleted = await AsyncStorage.getItem('dailyMissionsCompleted');
            const weeklyMissionsCompleted = await AsyncStorage.getItem('weeklyMissionsCompleted');
            const experience = await AsyncStorage.getItem('experience');
            const lastDailyReset = await AsyncStorage.getItem('lastDailyReset');
            const lastWeeklyReset = await AsyncStorage.getItem('lastWeeklyReset');

            loadedData = {
              quests: quests ? JSON.parse(quests) : [],
              achievements: achievements ? JSON.parse(achievements) : {},
              lastQuestDate: lastQuestDate ? new Date(lastQuestDate) : null,
              streak: streak ? parseInt(streak) : 0,
              dailyMissionProgress: dailyMissionProgress !== null ? parseInt(dailyMissionProgress) || 0 : 0,
              weeklyMissionProgress: weeklyMissionProgress !== null ? parseInt(weeklyMissionProgress) || 0 : 0,
              totalQuestsCompleted: totalQuestsCompleted !== null ? parseInt(totalQuestsCompleted) || 0 : 0,
              dailyMissionsCompleted: dailyMissionsCompleted !== null ? parseInt(dailyMissionsCompleted) || 0 : 0,
              weeklyMissionsCompleted: weeklyMissionsCompleted !== null ? parseInt(weeklyMissionsCompleted) || 0 : 0,
              experience: experience !== null ? parseInt(experience) || 0 : 0,
              lastDailyReset: lastDailyReset || new Date().toLocaleDateString('en-CA'),
              lastWeeklyReset: lastWeeklyReset || new Date().toLocaleDateString('en-CA'),
            };
          }

          set({
            quests: loadedData.quests,
            questCount: loadedData.quests.filter((q) => q.completed).length,
            achievements: loadedData.achievements,
            lastQuestDate: loadedData.lastQuestDate,
            streak: loadedData.streak,
            dailyMissionProgress: loadedData.dailyMissionProgress,
            weeklyMissionProgress: loadedData.weeklyMissionProgress,
            totalQuestsCompleted: loadedData.totalQuestsCompleted,
            dailyMissionsCompleted: loadedData.dailyMissionsCompleted,
            weeklyMissionsCompleted: loadedData.weeklyMissionsCompleted,
            experience: loadedData.experience,
            lastDailyReset: loadedData.lastDailyReset,
            lastWeeklyReset: loadedData.lastWeeklyReset,
            isLoading: false, 
          });

          const updatedState = get();
          
        } catch (error) {
          set({ isLoading: false }); 
        }
      },
  
      // Helper to save Quests and Achievements
      saveQuestsAndAchievements: async (quests, achievements, streak, lastQuestDate, dailyMissionProgress, weeklyMissionProgress) => {
        try {
            // Ensure safe defaults for each argument
            const safeQuests = quests ?? []; // Fallback to empty array if undefined or null
            const safeAchievements = achievements ?? {}; // Fallback to empty object if undefined or null
            const safeStreak = streak ?? 0; // Fallback to 0 if undefined or null
            const safeLastQuestDate = lastQuestDate ? lastQuestDate.toString() : ''; // Fallback to empty string if undefined or null
            const safeDailyMissionProgress = dailyMissionProgress ?? 0; // Fallback to 0 if undefined or null
            const safeWeeklyMissionProgress = weeklyMissionProgress ?? 0; // Fallback to 0 if undefined or null

            // Log the values being saved for debugging

            // Save locally in AsyncStorage
            await AsyncStorage.setItem('quests', JSON.stringify(safeQuests));
            await AsyncStorage.setItem('achievements', JSON.stringify(safeAchievements));
            await AsyncStorage.setItem('dailyMissionProgress', safeDailyMissionProgress.toString());
            await AsyncStorage.setItem('weeklyMissionProgress', safeWeeklyMissionProgress.toString());
            await AsyncStorage.setItem('streak', safeStreak.toString());
            await AsyncStorage.setItem('lastQuestDate', safeLastQuestDate);

            // Save to Firestore if the user is logged in
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userDocRef = firestore().collection('users').doc(user.uid);
                await userDocRef.update({
                    quests: safeQuests,
                    achievements: safeAchievements,
                    streak: safeStreak,
                    lastQuestDate: safeLastQuestDate,
                    dailyMissionProgress: safeDailyMissionProgress,
                    weeklyMissionProgress: safeWeeklyMissionProgress,
                });
            }
        } catch (error) {
            console.error('Error saving quests and achievements:', error);
        }
      },

      // Helper to save completed Missions and Quests
      updateCompletedMissionsAndQuests: async () => {
        try {
          set((state) => {
            const today = new Date();
      
            const todayLocalDate = today.toLocaleDateString('en-CA');
            const lastDailyReset = state.lastDailyReset ? new Date(state.lastDailyReset).toLocaleDateString('en-CA') : null;
            const lastWeeklyReset = state.lastWeeklyReset ? new Date(state.lastWeeklyReset).toLocaleDateString('en-CA') : null;
            
            let dailyMissionProgress = state.dailyMissionProgress;
            let dailyMissionsCompleted = state.dailyMissionsCompleted;

            if (!lastDailyReset || lastDailyReset !== todayLocalDate) {
              dailyMissionProgress = 0; 
              dailyMissionsCompleted = state.dailyMissionsCompleted + 1;
            }
      

            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const weekStartLocalDate = weekStart.toLocaleDateString('en-CA');
      
            let weeklyMissionProgress = state.weeklyMissionProgress;
            let weeklyMissionsCompleted = state.weeklyMissionsCompleted;
            
            if (!lastWeeklyReset || lastWeeklyReset < weekStartLocalDate) {
              weeklyMissionProgress = 0; 
              weeklyMissionsCompleted = state.weeklyMissionsCompleted + 1;
            }
      
  
            return {
              ...state, 
              dailyMissionProgress,
              weeklyMissionProgress,
              totalQuestsCompleted: state.quests.filter((quest) => quest.completed).length,
              dailyMissionsCompleted, 
              weeklyMissionsCompleted, 
              lastDailyReset: new Date().toString(),
              lastWeeklyReset: new Date().toString(),
            };
          });
      
          // Now that the state is updated, save the values to AsyncStorage or Firestore
          const currentState = useQuestStore.getState();
          const { dailyMissionProgress, weeklyMissionProgress, totalQuestsCompleted, dailyMissionsCompleted, weeklyMissionsCompleted, lastDailyReset, lastWeeklyReset } = currentState;
      
          // Save to AsyncStorage
          await AsyncStorage.setItem('dailyMissionProgress', dailyMissionProgress.toString());
          await AsyncStorage.setItem('weeklyMissionProgress', weeklyMissionProgress.toString());
          await AsyncStorage.setItem('totalQuestsCompleted', totalQuestsCompleted.toString());
          await AsyncStorage.setItem('dailyMissionsCompleted', dailyMissionsCompleted.toString());
          await AsyncStorage.setItem('weeklyMissionsCompleted', weeklyMissionsCompleted.toString());
          await AsyncStorage.setItem('lastDailyReset', lastDailyReset);
          await AsyncStorage.setItem('lastWeeklyReset', lastWeeklyReset);
      
          // Save to Firestore if user is logged in
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            await firestore().collection('users').doc(user.uid).update({
              totalQuestsCompleted,
              dailyMissionsCompleted,
              weeklyMissionsCompleted,
              dailyMissionProgress,
              weeklyMissionProgress,
              lastDailyReset,
              lastWeeklyReset,
            });
          }
      
          console.log('Missions and quests updated successfully.');
        } catch (error) {
          console.error('Error updating missions and quests:', error);
        }
      },
      
      // Add Quest
      addQuest: async (newQuest) => {
        set((state) => {
          const updatedQuests = [...state.quests, newQuest];
          const updatedQuestCount = updatedQuests.filter((quest) => quest.completed).length;
      
          // Assume no changes in daily/weekly mission progress when adding a new quest, 
          // so you can pass the current state values
          const { dailyMissionProgress, weeklyMissionProgress } = state;
          // Update state first
          return {
            quests: updatedQuests,
            questCount: updatedQuestCount,
            dailyMissionProgress, // Ensure the progress is retained
            weeklyMissionProgress, // Ensure the progress is retained
          };
        });
      
        // Call saveQuestsAndAchievements after state is updated
        const currentState = useQuestStore.getState();
      
        // Pass all necessary data to saveQuestsAndAchievements
        currentState.saveQuestsAndAchievements(
          currentState.quests,
          currentState.achievements,
          currentState.streak,
          currentState.lastQuestDate,
          currentState.dailyMissionProgress,  // Pass daily mission progress
          currentState.weeklyMissionProgress  // Pass weekly mission progress
        );
      },
      
      // Complete Quest and update the relevant states
      completeQuest: async (id) => {
        try {
          set((state) => {
            const today = new Date().toLocaleDateString('en-CA');
      
            const updatedQuests = state.quests.map((quest) => {
              if (quest.id === id && !quest.completed) {
                quest.completed = true;
                quest.completedDate = new Date(quest.dueDate).toLocaleDateString('en-CA');
              }
              return quest;
            });
      
          
            const completedQuests = updatedQuests
              .filter((quest) => quest.completed && quest.completedDate)
              .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
      
            let newStreak = 1;
            for (let i = 0; i < completedQuests.length - 1; i++) {
              const currentTaskDate = new Date(completedQuests[i].completedDate).toLocaleDateString('en-CA');
              const previousTaskDate = new Date(completedQuests[i + 1].completedDate).toLocaleDateString('en-CA');
      
              const dayDifference = (new Date(currentTaskDate).getTime() - new Date(previousTaskDate).getTime()) / (1000 * 3600 * 24);
      
              if (dayDifference === 1) {
                newStreak += 1;
              } else {
                break;
              }
            }
      
            const completedToday = updatedQuests.filter((quest) => quest.completedDate === today).length;
      
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekStartLocalDate = weekStart.toLocaleDateString('en-CA');
      
            const completedThisWeek = updatedQuests.filter(
              (quest) => new Date(quest.completedDate).toLocaleDateString('en-CA') >= weekStartLocalDate
            ).length;
      

            const dailyMissionProgress = completedToday >= 1 ? 1 : completedToday; 
            const weeklyMissionProgress = completedThisWeek >= 7 ? 7 : completedThisWeek; 
            

            return {
              quests: updatedQuests,
              streak: newStreak,
              dailyMissionProgress,
              weeklyMissionProgress,
            };
          });
      
          // Once the state is updated, get the current state and perform side effects
          const currentState = useQuestStore.getState();
      
          // Save updated quests, achievements, streaks, and progress to AsyncStorage and Firestore
          await currentState.saveQuestsAndAchievements(
            currentState.quests,
            currentState.achievements,
            currentState.streak,
            currentState.lastQuestDate,
            currentState.dailyMissionProgress,  // Pass the updated daily mission progress
            currentState.weeklyMissionProgress  // Pass the updated weekly mission progress
          );
      
          // Call updateCompletedMissionsAndQuests to handle the missions logic
          await currentState.updateCompletedMissionsAndQuests();
      
        } catch (error) {
          console.error('Error completing quest:', error);
        }
      },
      
      // Unmark a quest as incomplete update the relevant states
      unmarkQuest: async (id) => {
        set((state) => {
          const updatedQuests = state.quests.map((quest) => {
            if (quest.id === id && quest.completed) {
              return { ...quest, completed: false };
            }
            return quest;
          });
      
          
          const completedQuests = updatedQuests
            .filter((quest) => quest.completed)
            .sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()); 
      
          let newStreak = 1; 
      

          for (let i = 0; i < completedQuests.length - 1; i++) {
            const currentTaskDate = new Date(completedQuests[i].completedDate).toLocaleDateString('en-CA');
            const previousTaskDate = new Date(completedQuests[i + 1].completedDate).toLocaleDateString('en-CA');
      
            const dayDifference = (new Date(currentTaskDate).getTime() - new Date(previousTaskDate).getTime()) / (1000 * 3600 * 24);
      
            if (dayDifference === 1) {
              newStreak += 1;
              console.log(newStreak);
            } else {
              break;
            }
          }
      
          const updatedQuestCount = updatedQuests.filter((quest) => quest.completed).length;
          let dailyMissionProgress = state.dailyMissionProgress;
          let weeklyMissionProgress = state.weeklyMissionProgress;
      
          if (dailyMissionProgress > 0) {
            dailyMissionProgress -= 1;
          }
      
          if (weeklyMissionProgress > 0) {
            weeklyMissionProgress -= 1;
          }
      
          return {
            quests: updatedQuests,
            questCount: updatedQuestCount,
            dailyMissionProgress,
            weeklyMissionProgress,
            streak: newStreak,
          };
        });
      
        const currentState = useQuestStore.getState();
        await currentState.saveQuestsAndAchievements(
          currentState.quests,
          currentState.achievements,
          currentState.streak,
          currentState.lastQuestDate,
          currentState.dailyMissionProgress,  
          currentState.weeklyMissionProgress 
        );
        await currentState.updateCompletedMissionsAndQuests();
      },
      
      // Check and save achievements
      checkAchievements: async () => {
        const state = get();
        const { questCount, streak, dailyMissionProgress, weeklyMissionProgress, achievements } = state;
    
        const newAchievements = { ...achievements };
    
        // Quest-based achievements
        if (questCount >= 1) newAchievements['Complete 1 Quest'] = true;
        if (questCount >= 5) newAchievements['Complete 5 Quests'] = true;
        if (questCount >= 10) newAchievements['Complete 10 Quests'] = true;
    
        // Streak-based achievements
        if (streak >= 1) newAchievements['1 Day Streak'] = true;
        if (streak >= 4) newAchievements['4 Day Streak'] = true;
        if (streak >= 7) newAchievements['7 Day Streak'] = true;
    
        // Challenge-based achievements
        if (dailyMissionProgress >= 1) newAchievements['Complete 1 Daily Challenge'] = true;
        if (dailyMissionProgress >= 3) newAchievements['Complete 3 Daily Challenges'] = true;
        if (weeklyMissionProgress >= 7) newAchievements['Complete 1 Weekly Challenge'] = true;
    
        // Save achievements in the state
        set({ achievements: newAchievements });
    
        // Save to AsyncStorage
        await AsyncStorage.setItem('achievements', JSON.stringify(newAchievements));
    
        // Update in Firestore if user is logged in
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userDocRef = firestore().collection('users').doc(user.uid);
          await userDocRef.update({
            achievements: newAchievements,
          });
        }
      },

      // Load achievements from AsyncStorage (or Firestore if logged in)
      loadAchievements: async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        let loadedAchievements = {};
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            loadedAchievements = userDoc.data().achievements || {};
          }
        } else {
          const storedAchievements = await AsyncStorage.getItem('achievements');
          loadedAchievements = storedAchievements ? JSON.parse(storedAchievements) : {};
        }

        set({ achievements: loadedAchievements });
      },

      // Get important quests (highest importance)
      getImportantQuests: () => {
        const state = useQuestStore.getState();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
      
        return state.quests.filter((quest) => {
          const questDueDate = new Date(quest.dueDate);
          return quest.importance === 3 && !quest.completed && questDueDate >= today;
        });
      },
      

      // Get missed quests (overdue quests)
      getMissedQuests: () => {
        const state = useQuestStore.getState();
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        return state.quests.filter((quest) => {
            const questDueDate = new Date(quest.dueDate);
            return questDueDate < today && !quest.completed;
        });
    },
    

      // Function to get quests for a specific date
      getQuestsForDate: (selectedDate) => {
        const state = useQuestStore.getState();
        return state.quests.filter(
          (quest) => new Date(quest.dueDate).toISOString().split('T')[0] === selectedDate
        );
      },
  
    }),{
      name: 'quest-store', 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useQuestStore;
