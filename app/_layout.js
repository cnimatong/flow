import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { YStack, TamaguiProvider, Button, Dialog } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Calendar, BarChart, User, PlusCircle } from '@tamagui/lucide-icons'; // Icons updated
import AddQuestForm from '../src/components/dialogs/AddQuestForm';  // Import the AddQuestForm
import appConfig from '../tamagui.config';
import { useIntroStore } from '../src/store/useIntroStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const { hasSeenIntro, initialize, isLoading } = useIntroStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false); // State for dialog visibility

  useEffect(() => {
    const checkIntroAndLoginStatus = async () => {
      await initialize();
      const userId = await AsyncStorage.getItem('userId');
      setIsLoggedIn(!!userId);
      setIsMounted(true);
    };
    checkIntroAndLoginStatus();
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (!hasSeenIntro) {
        router.replace('intro');
      } else if (!isLoggedIn) {
        router.replace('login');
      }
    }
  }, [isMounted, isLoading, hasSeenIntro, isLoggedIn]);

  if (isLoading) {
    return null; // Optionally, render a loading spinner here
  }

  // Define the routes where the bottom navigation should be hidden (login/signup/nameEntry)
  const hideNavigationRoutes = ['intro', 'login', 'signup', 'nameEntry'];
  const hideNavigation = hideNavigationRoutes.includes(segments[0]); // Check if the current route should hide the bottom bar

  const handleOpenDialog = () => {
    setIsDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setIsDialogVisible(false);
  };

  // Function to determine the active tab and apply blue color for the selected tab
  const getTabColor = (path) => {
    const currentSegment = segments[0] === '' ? '/' : segments[0]; // Treat the root path ('/') as an empty string in segments
    return currentSegment === path ? '#3498db' : '#444'; // Apply blue color to the active tab
  };


  return (
    <TamaguiProvider config={appConfig}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <YStack flex={1}>
          <Slot />

          {/* Conditionally show bottom navigation if not in the login/signup/nameEntry flow */}
          {!hideNavigation && (
            <YStack
              flexDirection="row"
              justifyContent="space-between" // Spread icons evenly
              alignItems="center"
              height={80}
              position="absolute"
              bottom={0}
              width="100%"
              paddingHorizontal={20}
              borderTopWidth={1}
              borderTopColor="transparent" // Remove border
              shadowColor="#000"
              shadowOffset={{ width: 0, height: -2 }} // Subtle upward shadow
              shadowOpacity={0.2}
              shadowRadius={4}
            >
              {/* Home Button */}
              <Button onPress={() => router.push('/')} theme="light">
                <YStack alignItems="center">
                  <Home color={getTabColor('')} size={28} />
                </YStack>
              </Button>

              {/* Calendar (Quests) Button */}
              <Button onPress={() => router.push('/quests')} theme="light">
                <YStack alignItems="center">
                  <Calendar color={getTabColor('quests')} size={28} />
                </YStack>
              </Button>

              {/* Add Task Button */}
              <Button onPress={handleOpenDialog} theme="light">
                <YStack alignItems="center">
                  <PlusCircle color="red" size={28} />
                </YStack>
              </Button>

              {/* Leaderboards Button */}
              <Button onPress={() => router.push('/leaderboards')} theme="light">
                <YStack alignItems="center">
                  <BarChart color={getTabColor('leaderboards')} size={28} />
                </YStack>
              </Button>

              {/* Profile/Stats Button */}
              <Button onPress={() => router.push('/profile')} theme="light">
                <YStack alignItems="center">
                  <User color={getTabColor('profile')} size={28} />
                </YStack>
              </Button>
            </YStack>
          )}
        </YStack>

        {/* Dialog that opens with the add task button */}
        <Dialog open={isDialogVisible} onDismiss={handleCloseDialog}>
          <Dialog.Portal>
            {/* When tapping outside (on the overlay), the dialog will close */}
            <Dialog.Overlay key="dialog-overlay" onPress={handleCloseDialog} />
            <Dialog.Content key="dialog-content"> 
              <AddQuestForm onClose={handleCloseDialog} /> 
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </SafeAreaView>
    </TamaguiProvider>
  );
}
