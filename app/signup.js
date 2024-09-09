import React, { useState } from 'react';
import { YStack, Input, Button, Text } from 'tamagui';
import auth from '@react-native-firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native'; 

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { height } = useWindowDimensions();

  const handleSignUp = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await AsyncStorage.setItem('userId', user.uid);

      router.replace('/nameEntry');
    } catch (error) {
      setError(error.message);
    }
  };

  const goToLogin = () => {
    router.push('/login'); 
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
          Sign Up
        </Text>

        {/* Email Input */}
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

        {/* Password Input */}
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

        {/* Sign Up Button */}
        <Button onPress={handleSignUp} backgroundColor="#3498db" paddingVertical={12} borderRadius={8}>
          <Text color="#fff" fontWeight="bold" fontSize={16}>
            Sign Up
          </Text>
        </Button>

        {/* Error Message */}
        {error && (
          <Text color="red" marginTop={10} textAlign="center">
            {error}
          </Text>
        )}

        {/* Navigate to Login Button */}
        <Button onPress={goToLogin} marginTop={10} backgroundColor="#e74c3c" paddingVertical={12} borderRadius={8}>
          <Text color="#fff" fontWeight="bold" fontSize={16}>
            Already have an account? Log In
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}
