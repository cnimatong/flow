import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { YStack, Button, Text } from 'tamagui';
import ProfileHeader from '../src/components/profile/ProfileHeader';
import AchievementsSection from '../src/components/profile/AchievementsSection';
import MissionsSection from '../src/components/profile/MissionsSection';
import RankingSection from '../src/components/profile/RankingSection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../src/store/useAuthStore';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from '@react-native-firebase/auth'; // Firebase auth for sign-out


export default function Profile() {
  const setAuthState = useAuthStore((state) => state.setAuthState);
  const router = useRouter();

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

  const handleClearAsyncStorage = async () => {
    try {
      // Clear AsyncStorage
      clearAsyncStorage();
  
      // Reset the intro screen state (if applicable)
      // resetIntroState(); // Assuming you have a function like this in your intro store
  
      // Reset the auth state
      setAuthState(false, true); // Sign out and treat as a guest
  
      // Redirect to the login screen
      router.replace('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out and reset your data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: handleClearAsyncStorage,
        },
      ],
      { cancelable: true }
    );
  };
  

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }} 
      showsVerticalScrollIndicator={false} 
    >
      <YStack padding={20}>
        {/* Profile Header with XP and Level */}
        <ProfileHeader />

        {/* Missions Section */}
        <MissionsSection />

        {/* Ranking Section */}
        <RankingSection />

        {/* Achievements Section */}
        <AchievementsSection />

        {/* Sign Out Button */}
        <YStack marginTop={30} alignItems="center" width="100%">
          <Button
            onPress={handleSignOut}
            backgroundColor="#e74c3c" 
            width="100%"
            paddingVertical={15}
            borderRadius={10}
            shadowColor="#000"
            shadowOpacity={0.1}
            shadowRadius={5}
            height={50} 
          >
            <Text color="white" fontWeight="bold" fontSize={16}>
              Sign Out
            </Text>
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
