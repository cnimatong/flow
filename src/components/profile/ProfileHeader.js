import React from 'react';
import { YStack, Text, Progress } from 'tamagui';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileHeader() {
  const userData = useAuthStore((state) => state.userData); 

  const experience = userData.experience || 0;
  const experienceToNextLevel = userData.experienceToNextLevel || 100;
  const experiencePercentage = experienceToNextLevel
    ? (experience / experienceToNextLevel) * 100
    : 0;

  return (
    <YStack
      backgroundColor="white" 
      padding={20}             
      borderRadius={12}         
      shadowColor="#000"        
      shadowOffset={{ width: 0, height: 4 }} 
      shadowOpacity={0.1}       
      shadowRadius={10}       
      marginHorizontal={16}     
      marginVertical={10}      
      alignItems="center"      
    >
      <Text fontSize={24} fontWeight="bold" marginBottom={10}>
        {userData.name || 'Flow User'}
      </Text>

      <Text color="#999" marginBottom={5}>
        Level {userData.level || 1}
      </Text>

      <Text color="#999" fontSize={12} marginBottom={5}>
        Experience: {experience} / {experienceToNextLevel} XP
      </Text>

      <Progress size="$4" value={experiencePercentage}>
        <Progress.Indicator
          animation="bouncy"
          backgroundColor="#3498db" 
        />
      </Progress>
    </YStack>
  );
}
