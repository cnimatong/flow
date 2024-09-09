import React, { useState } from 'react';
import { YStack, Input, Button, Text } from 'tamagui';
import auth from '@react-native-firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { height } = useWindowDimensions(); 
  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      await AsyncStorage.setItem('userId', user.uid);
  
      router.replace('/nameEntry');
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          setError('The email address is badly formatted.');
          break;
        case 'auth/user-disabled':
          setError('This user account has been disabled.');
          break;
        case 'auth/user-not-found':
          setError('There is no user corresponding to this email.');
          break;
        case 'auth/wrong-password':
          setError('The password entered is incorrect.');
          break;
        default:
          setError('An error occurred. Please try again.');
          break;
      }
    }
  };
  

  const handleGuestLogin = async () => {
    await AsyncStorage.setItem('userId', 'guest');

    router.replace('/nameEntry');
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
          Login
        </Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          backgroundColor="#f9f9f9"
          borderRadius={8}
          padding={12}
          fontSize={16}
          marginBottom={15}
          borderColor="#ddd"
          borderWidth={1}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          backgroundColor="#f9f9f9"
          borderRadius={8}
          padding={12}
          fontSize={16}
          marginBottom={15}
          borderColor="#ddd"
          borderWidth={1}
        />

        <Button onPress={handleLogin} backgroundColor="#3498db" paddingVertical={12} borderRadius={8}>
          <Text color="#fff" fontWeight="bold" fontSize={16}>
            Login
          </Text>
        </Button>

        <Button onPress={() => router.push('/signup')} marginTop={10} backgroundColor="#2ecc71" paddingVertical={12} borderRadius={8}>
          <Text color="#fff" fontWeight="bold" fontSize={16}>
            Sign Up
          </Text>
        </Button>

        <Button onPress={handleGuestLogin} marginTop={10} backgroundColor="#e74c3c" paddingVertical={12} borderRadius={8}>
          <Text color="#fff" fontWeight="bold" fontSize={16}>
            Continue as Guest
          </Text>
        </Button>

        {error && (
          <Text color="red" marginTop={10} textAlign="center">
            {error}
          </Text>
        )}
      </YStack>
    </YStack>
  );
}
