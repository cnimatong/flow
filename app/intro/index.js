import React, { useState } from 'react';
import { YStack, Text, Button, Image } from 'tamagui';
import { useRouter } from 'expo-router';
import { useIntroStore } from '../../src/store/useIntroStore';
import { useWindowDimensions } from 'react-native';

const IntroScreens = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const markIntroSeen = useIntroStore((state) => state.markIntroSeen);
  const router = useRouter();
  const { height, width } = useWindowDimensions(); // For responsive layout

  const screens = [
    {
      title: 'Welcome to Flow',
      description: 'Manage your tasks with ease.',
      image: require('../../src/assets/icon1.png'), // Placeholder for an image
    },
    {
      title: 'Track Your Progress',
      description: 'Stay on top of your daily tasks.',
      image: require('../../src/assets/trackProgress.png'), // Placeholder for an image
    },
    {
      title: 'Stay Motivated',
      description: 'Earn rewards as you complete tasks.',
      image: require('../../src/assets/stayMotivated.png'), // Placeholder for an image
    },
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      markIntroSeen();
      router.replace('/login'); // Redirect to login screen after intro
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="#f5f5f5"
      paddingHorizontal={20}
      paddingBottom={30} // Ensures there's space at the bottom for the button
    >
      {/* Placeholder for image/graphic or animation */}
      <Image
        source={screens[currentScreen].image} // Displays the relevant image for each screen
        resizeMode="contain"
        style={{ width: width * 0.8, height: height * 0.4, marginBottom: 30 }}
      />

      <Text fontSize={28} fontWeight="bold" textAlign="center" color="#2c3e50" marginBottom={15}>
        {screens[currentScreen].title}
      </Text>

      <Text fontSize={18} textAlign="center" color="#7f8c8d" marginBottom={30}>
        {screens[currentScreen].description}
      </Text>

      <Button
        onPress={handleNext}
        backgroundColor="#3498db"
        width="90%" // Reduced the width for better aesthetics
        borderRadius={10} // Slightly more rounded button
        paddingVertical={15} // Ensuring enough vertical padding to display the text
        alignItems="center"
        justifyContent="center" // Centering the content inside the button
      >
        <Text color="#fff" fontSize={16} fontWeight="bold" style={{ lineHeight: 16 }}>
          {currentScreen < screens.length - 1 ? 'Next' : 'Get Started'}
        </Text>
      </Button>
    </YStack>
  );
};

export default IntroScreens;
