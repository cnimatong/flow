import React, { useState, useEffect } from 'react';
import { YStack, Input, Button, Text } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native'; 

export default function NameEntryScreen() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const user = auth().currentUser; 
  const { height } = useWindowDimensions();
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    const checkForStoredName = async () => {
      try {
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const storedName = userDoc.data().name;
            setName(storedName);
            setIsEditing(!!storedName); 
          }
        } else {
          const storedName = await AsyncStorage.getItem('name');
          if (storedName) {
            setName(storedName);
            setIsEditing(!!storedName); 
          }
        }
      } catch (error) {
        if (error.code === 'firestore/permission-denied') {
          console.warn('Firestore permission denied. Guest users do not have access to Firestore.');
        } else {
          console.error('Error retrieving name:', error);
        }
      }
    };

    checkForStoredName();
  }, [user]);

  const handleSaveName = async () => {
    if (!name) {
      setError('Please enter a name');
      return;
    }

    try {
      if (user) {
        await firestore().collection('users').doc(user.uid).set({ name }, { merge: true });
      } else {
        await AsyncStorage.setItem('name', name);
      }
      router.replace('/'); 
    } catch (error) {
      if (error.code === 'firestore/permission-denied') {
        console.warn('Firestore permission denied. Saving name locally.');
        await AsyncStorage.setItem('name', name); 
        router.replace('/');
      } else {
        console.error('Error saving name:', error);
        setError('Error saving your name. Please try again.');
      }
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="center" 
      alignItems="center"      
      paddingHorizontal={20}
      height={height}
      backgroundColor="#f9f9f9" 
    >
      <YStack width="100%" maxWidth={350} space>
        <Text fontSize={24} fontWeight="bold" marginBottom={20} textAlign="center">
          {isEditing ? 'Edit Your Name' : 'Enter Your Name'} 
        </Text>

        {/* Name Input */}
        <Input
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
          backgroundColor="#f9f9f9"
          borderRadius={8}
          padding={12}
          fontSize={16}
          marginBottom={15}
          borderColor="#ddd"
          borderWidth={1}
        />

        {/* Save Name Button */}
        <Button onPress={handleSaveName} backgroundColor="#3498db" paddingVertical={12} borderRadius={8}>
          <Text color="#fff" fontWeight="bold" fontSize={16}>
            Save Name
          </Text>
        </Button>

        {/* Error Message */}
        {error && (
          <Text color="red" marginTop={10} textAlign="center">
            {error}
          </Text>
        )}
      </YStack>
    </YStack>
  );
}
