import React, { useEffect, useMemo, useState } from 'react';
import { YStack, Button, XStack, AlertDialog, ScrollView, Text } from 'tamagui';
import TopSection from '../src/components/home/TopSection';
import AnalyticsSection from '../src/components/home/AnalyticsSection';
import ImportantTasksSection from '../src/components/home/ImportantTasksSection';
import MissedTasksSection from '../src/components/home/MissedTasksSection';
import useQuestStore from '../src/store/questStore'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIntroStore } from '../src/store/useIntroStore'; 
import { useAuthStore } from '../src/store/useAuthStore'; 
import { getAuth, signOut } from '@react-native-firebase/auth';

const clearAsyncStorage = async () => {
  try {
    const auth = getAuth();
    if (auth.currentUser) {
      await signOut(auth); // Sign out from Firebase
      console.log('User signed out from Firebase');
    }

    // Clear AsyncStorage data
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully');

    // Reset authentication state (Zustand store)
    const { setAuthState } = useAuthStore.getState();
    setAuthState(false, { level: 1, experience: 0, experienceToNextLevel: 100 }); // Reset user data to defaults
    console.log('Authentication state reset');
    
  } catch (error) {
    console.error('Error clearing AsyncStorage or resetting auth state:', error);
  }
};

const HomePage = () => {
  const {
    quests,
    loadQuestsAndAchievements, 
    getImportantQuests,
    getMissedQuests,
  } = useQuestStore();

  const { resetIntroState } = useIntroStore(); 
  const { isSignedIn, userData } = useAuthStore();  

  const [dialogOpen, setDialogOpen] = useState(false);  
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {
    const initializeHomePage = async () => {
      await loadQuestsAndAchievements(); 
      setLoading(false);  
    };
    initializeHomePage();
  }, [isSignedIn]);

  const importantTasks = useMemo(() => {
    return getImportantQuests ? getImportantQuests() : []; 
  }, [quests]);

  const missedTasks = useMemo(() => {
    return getMissedQuests ? getMissedQuests() : [];  
  }, [quests]);

  const handleClearAsyncStorage = () => {
    clearAsyncStorage(); 
    resetIntroState();    
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding={20} backgroundColor="#f5f5f5">
      <TopSection />
      <AnalyticsSection userData={userData} />
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        <ImportantTasksSection tasks={importantTasks} />
        <MissedTasksSection tasks={missedTasks} />
        {/* <Button marginTop={20} onPress={() => setDialogOpen(true)}>Reset App Data</Button> */}
      </ScrollView>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen} key="resetDialog">
        <AlertDialog.Portal>
          <AlertDialog.Overlay key="overlay" />
          <AlertDialog.Content key="content">
            <YStack padding={20}>
              <AlertDialog.Title>Reset App Data</AlertDialog.Title>
              <AlertDialog.Description>
                Are you sure you want to reset all app data? This action cannot be undone.
              </AlertDialog.Description>
              <XStack space="$4" justifyContent="flex-end">
                <AlertDialog.Cancel asChild key="cancelButton">
                  <Button onPress={() => setDialogOpen(false)}>Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild key="confirmButton">
                  <Button onPress={handleClearAsyncStorage}>Confirm</Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
};

export default HomePage;
