import React, { useEffect, useState } from 'react';
import { YStack, Text, Progress, Button } from 'tamagui';
import { useAuthStore } from '../../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';

export default function RankingSection() {
  const [name, setName] = useState('');
  const [rank, setRank] = useState(0);
  const [totalRanks, setTotalRanks] = useState(0); 
  const [experience, setExperience] = useState(0);
  const [experienceToNextRank, setExperienceToNextRank] = useState(100); 
  const [nextRankXP, setNextRankXP] = useState(null); 
  const [nextRankName, setNextRankName] = useState(''); 

  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const isGuest = useAuthStore((state) => state.isGuest);
  const router = useRouter();

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        if (isSignedIn && !isGuest) {
          const user = auth().currentUser;

          if (user) {
            const usersSnapshot = await firestore().collection('users').get();
            const usersData = usersSnapshot.docs.map(doc => ({
              ...doc.data(),
              uid: doc.id,
            }));

            usersData.sort((a, b) => (b.totalExp || 0) - (a.totalExp || 0));

            const currentUserData = usersData.find(userDoc => userDoc.uid === user.uid);
            const userRank = usersData.findIndex(userDoc => userDoc.uid === user.uid) + 1;

            setName(currentUserData?.name || 'Unknown User');
            setRank(userRank);
            setTotalRanks(usersData.length);
            setExperience(currentUserData?.experience || 0);
            setExperienceToNextRank(currentUserData?.experienceToNextLevel || 100);

            if (userRank > 1) {
              const nextRankUser = usersData[userRank - 2]; 
              setNextRankXP(nextRankUser.totalExp - currentUserData.totalExp);
              setNextRankName(nextRankUser.name);
            }
          }
        } else if (isGuest) {
          const storedName = await AsyncStorage.getItem('name');
          if (storedName) {
            setName(storedName);
          }
        }
      } catch (error) {
        console.error('Error fetching ranking data:', error);
      }
    };

    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        useAuthStore.getState().setAuthState(true, false);
      } else {
        useAuthStore.getState().setAuthState(false, true);
      }
      fetchRankingData();
    });

    return () => unsubscribe();
  }, [isSignedIn, isGuest]);

  const progressPercentage = experienceToNextRank
    ? Math.min((experience / experienceToNextRank) * 100, 100)
    : 0;

  if (!isSignedIn || isGuest) {
    return (
      <YStack alignItems="center" padding={20}>
        <Text>You need to log in to view your ranking.</Text>
        <Button onPress={() => router.push('/login')}>Log In</Button>
      </YStack>
    );
  }

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
      <Text fontSize={20} fontWeight="bold" marginBottom={10}>
        Standing
      </Text>
      <Text fontSize={16} color="#999" marginBottom={10}>
        Rank {rank} / {totalRanks}
      </Text>

      {rank !== 1 && (
        <>
          <Text fontSize={14} color="#666" marginBottom={5}>
            Experience: {experience} / {experienceToNextRank} XP
          </Text>
          <Progress size="$4" value={progressPercentage}>
            <Progress.Indicator
              animation="bouncy"
              backgroundColor={progressPercentage === 100 ? '#4CAF50' : '#3498db'} 
            />
          </Progress>

          <Text fontSize={14} color="#666" marginTop={10}>
            {nextRankXP} XP to surpass {nextRankName || 'the next rank'}
          </Text>
        </>
      )}

      {rank === 1 && (
        <Text fontSize={14} color="#666" marginTop={10}>
          You are at the top!
        </Text>
      )}
    </YStack>
  );
}
