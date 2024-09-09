import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const useAuthStore = create((set) => ({
  isSignedIn: false,
  isGuest: false,
  userData: {
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
  },
  
  // Initialize the store, loading any saved data from AsyncStorage or Firebase
  initialize: async () => {
    try {
      const guestStatus = await AsyncStorage.getItem('isGuest');
      const userId = await AsyncStorage.getItem('userId');
      const userData = await AsyncStorage.getItem('userData');
  
      if (guestStatus === 'true') {
        set({ 
          isSignedIn: false, 
          isGuest: true, 
          userData: {
            level: 1,
            experience: 0, 
            experienceToNextLevel: 100,
          },
        });
        console.log('User is a guest with experience 0');
      } else if (userId) {
        await useAuthStore.getState().setAuthState(true, JSON.parse(userData));
      } else {
        await AsyncStorage.setItem('isGuest', 'true');
        set({ 
          isSignedIn: false, 
          isGuest: true,
          userData: {
            level: 1,
            experience: 0, 
            experienceToNextLevel: 100,
          },
        });
        console.log('User automatically set as guest with experience 0');
      }
    } catch (error) {
      console.error('Error initializing auth store:', error);
    }
  },
  
  // Set authentication state and load user data
  setAuthState: async (isSignedIn, userData) => {
    if (isSignedIn) {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          const firebaseData = userDoc.exists ? userDoc.data() : {};

          set({
            isSignedIn: true,
            isGuest: false,
            userData: {
              ...firebaseData,
              level: firebaseData.level || 1,
              experience: firebaseData.experience || 0,
              experienceToNextLevel: firebaseData.experienceToNextLevel || 100,
            },
          });

          await AsyncStorage.setItem('userData', JSON.stringify(firebaseData));
        }
      });
    } else {
      set({ isSignedIn: false, isGuest: true, userData });
    }
  },

  // Sign in the user and sync guest data
  signIn: async (userId) => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();
      const cloudData = userDoc.exists ? userDoc.data() : {
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
      };

      const guestData = await AsyncStorage.getItem('userData');

      if (guestData) {
        const parsedGuestData = JSON.parse(guestData);

        Alert.alert(
          'Choose Data to Use',
          'You have local data from your guest session. Do you want to use your local data or cloud data?',
          [
            {
              text: 'Local Data',
              onPress: async () => {
                const mergedData = {
                  ...cloudData,
                  level: Math.max(cloudData.level, parsedGuestData.level), 
                  experience: parsedGuestData.experience,
                  experienceToNextLevel: parsedGuestData.experienceToNextLevel,
                };

                await firestore().collection('users').doc(userId).set(mergedData, { merge: true });

                set({ isSignedIn: true, isGuest: false, userData: mergedData });
                await AsyncStorage.removeItem('userData');
                await AsyncStorage.setItem('isGuest', 'false');
                console.log('Local data used and synced to Firebase');
              },
            },
            {
              text: 'Cloud Data',
              onPress: async () => {
                set({ isSignedIn: true, isGuest: false, userData: cloudData });
                await AsyncStorage.removeItem('userData'); 
                await AsyncStorage.setItem('isGuest', 'false');
                console.log('Cloud data used');
              },
              style: 'cancel', 
            },
          ]
        );
      } else {
        set({ isSignedIn: true, isGuest: false, userData: cloudData });
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('isSignedIn', 'true');
        await AsyncStorage.setItem('userData', JSON.stringify(cloudData));
        console.log('Signed in with cloud data');
      }
    } catch (error) {
      console.error('Error signing in and syncing data:', error);
    }
  },

  // Sign out the user and clear their data
  signOut: async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);

      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('isSignedIn');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.setItem('isGuest', 'true');

      set({
        isSignedIn: false,
        isGuest: true,
        userData: {
          level: 1,
          experience: 0,
          experienceToNextLevel: 100,
        },
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  // Load the authentication status and user data from AsyncStorage or Firestore
  loadAuthStatus: async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const userDoc = await firestore().collection('users').doc(userId).get();
        const firebaseData = userDoc.exists ? userDoc.data() : null;

        if (firebaseData) {
          set({
            isSignedIn: true,
            userData: firebaseData,
          });

          await AsyncStorage.setItem('userData', JSON.stringify(firebaseData));
        }
      }
    } catch (error) {
      console.error('Error loading auth status:', error);
    }
  },

  // Gain experience points and handle leveling up
  gainExperience: async (xpGained) => {
    const updatedUserData = useAuthStore.getState().userData;
    let { experience, experienceToNextLevel, level, totalExp = 0 } = updatedUserData;

    experience += xpGained;
    totalExp += xpGained; 

    while (experience >= experienceToNextLevel) {
      experience -= experienceToNextLevel;
      level += 1;
      experienceToNextLevel = Math.floor(experienceToNextLevel * 1.5); 
    }

    const finalUserData = {
      ...updatedUserData,
      experience,
      totalExp, 
      level,
      experienceToNextLevel,
    };

    set({ userData: finalUserData });

    await AsyncStorage.setItem('userData', JSON.stringify(finalUserData));

    const auth = getAuth();
    if (auth.currentUser) {
      const userDocRef = firestore().collection('users').doc(auth.currentUser.uid);
      await userDocRef.set(finalUserData, { merge: true }); 
    }
  },

// lose experience points
  loseExperience: async (xpLost) => {
    const updatedUserData = useAuthStore.getState().userData;
    let { experience, level, experienceToNextLevel, totalExp = 0 } = updatedUserData;

    experience -= xpLost;

    if (experience < 0) {
      experience = 0;
    }

    const finalUserData = {
      ...updatedUserData,
      experience,
      totalExp, 
      level,
      experienceToNextLevel,
    };

    set({ userData: finalUserData });

    await AsyncStorage.setItem('userData', JSON.stringify(finalUserData));

    const auth = getAuth();
    if (auth.currentUser) {
      const userDocRef = firestore().collection('users').doc(auth.currentUser.uid);
      await userDocRef.set(finalUserData, { merge: true }); 
    }
  },
}));

export default useAuthStore;
