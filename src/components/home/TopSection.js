import React, { useEffect, useState } from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { BellIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

// Helper function to get greeting based on time of day
const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

const TopSection = () => {
  const [userName, setUserName] = useState(''); 
  const greeting = getGreeting(); 

  // Function to fetch the user's name from either AsyncStorage or Firestore
  const fetchUserName = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserName(userData.name || 'User'); 
        }
      } else {
        const storedName = await AsyncStorage.getItem('userName');
        setUserName(storedName || 'Guest'); 
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  useEffect(() => {
    fetchUserName(); 
  }, []);

  return (
    <YStack paddingVertical={10} paddingHorizontal={0}>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={18} fontWeight="bold" textAlign="left">
          {greeting}, {userName}
        </Text>
      </XStack>
    </YStack>
  );
};

export default TopSection;
