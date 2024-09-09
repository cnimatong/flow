import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import { Select, YStack, Text, XStack, Button, Sheet, Adapt } from 'tamagui';
import { useAuthStore } from '../src/store/useAuthStore';
import { useRouter } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ChevronDown, Check, ChevronUp } from '@tamagui/lucide-icons';

const leaderboardCategories = {
  totalExp: [],
  streaks: [],
  questsCompleted: [],
};

export default function Leaderboard() {
  useEffect(() => {
    LogBox.ignoreLogs(['onAnimatedValueUpdate']); 

    return () => {
      LogBox.ignoreAllLogs();
    };
  }, []);

  const [currentCategory, setCurrentCategory] = useState('totalExp');
  const [leaderboardData, setLeaderboardData] = useState(leaderboardCategories);
  const [selectedData, setSelectedData] = useState([]);
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const isGuest = useAuthStore((state) => state.isGuest);
  const currentUserName = useAuthStore((state) => state.userData.name); 
  const [selectedCategory, setSelectedCategory] = useState('totalExp');
  const router = useRouter();

  const setAuthState = useAuthStore((state) => state.setAuthState);

  const items = [
    { label: 'Total Exp', value: 'totalExp' },
    { label: 'Streaks', value: 'streaks' },
    { label: 'Quests Completed', value: 'questsCompleted' },
  ];

  useEffect(() => {
    const fetchLeaderboardData = async (user) => {
      try {
        if (isSignedIn && user && !isGuest) {
          const usersSnapshot = await firestore().collection('users').get();
          const fetchedData = {
            totalExp: [],
            streaks: [],
            questsCompleted: [],
          };

          usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            fetchedData.totalExp.push({
              name: userData.name,
              totalExp: userData.totalExp || 0, 
            });
            fetchedData.streaks.push({
              name: userData.name,
              streaks: userData.streak || 0,
            });
            fetchedData.questsCompleted.push({
              name: userData.name,
              questsCompleted: userData.totalQuestsCompleted || 0,
            });
          });

          // Sort the data
          fetchedData.totalExp.sort((a, b) => b.totalExp - a.totalExp); 
          fetchedData.streaks.sort((a, b) => b.streaks - a.streaks); 
          fetchedData.questsCompleted.sort((a, b) => b.questsCompleted - a.questsCompleted); 

          setLeaderboardData(fetchedData); 
          setSelectedData(fetchedData[currentCategory]); 
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setAuthState(true, { level: 1, experience: 0, experienceToNextLevel: 100 });
        fetchLeaderboardData(currentUser);
      } else {
        setAuthState(false, { level: 1, experience: 0, experienceToNextLevel: 100 });
      }
    });

    return () => unsubscribe();
  }, [isSignedIn, isGuest, currentCategory, setAuthState]);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setSelectedData(leaderboardData[category]); 
  };

  if (!isSignedIn || isGuest) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#f5f5f5">
        <Text fontSize={18} marginBottom={10}>
          You need to sign in to view the leaderboard.
        </Text>
        <Button onPress={() => router.replace('/login')}>Sign In</Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding={20} backgroundColor="#f5f5f5">
      {/* Select Dropdown for Category */}
      <YStack marginBottom={20}>
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            handleCategoryChange(value);
          }}
          style={{
            shadowColor: "#000", 
            shadowOffset: { width: 0, height: 4 }, 
            shadowOpacity: 0.1, 
            shadowRadius: 10, 
          }}
        >
          <Select.Trigger width={175} iconAfter={ChevronDown}>
            <Select.Value placeholder="Select Category" />
          </Select.Trigger>

          <Adapt when="sm" platform="touch">
            <Sheet modal dismissOnSnapToBottom>
              <Sheet.Frame>
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Frame>
              <Sheet.Overlay />
            </Sheet>
          </Adapt>

          <Select.Content zIndex={200000}>
            <Select.ScrollUpButton alignItems="center" justifyContent="center" height="$3">
              <YStack zIndex={10}>
                <ChevronUp size={20} />
              </YStack>
            </Select.ScrollUpButton>

            <Select.Viewport minWidth={200}>
              <Select.Group>
                {items.map((item, i) => (
                  <Select.Item key={i} value={item.value}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>

            <Select.ScrollDownButton alignItems="center" justifyContent="center" height="$3">
              <YStack zIndex={10}>
                <ChevronDown size={20} />
              </YStack>
            </Select.ScrollDownButton>
          </Select.Content>
        </Select>
      </YStack>

      {/* Leaderboard Table */}
      <YStack>
        <XStack justifyContent="space-between" paddingHorizontal={20} marginBottom={10}>
          <Text fontWeight="bold">#</Text>
          <Text fontWeight="bold">Name</Text>
          {currentCategory === 'totalExp' && <Text fontWeight="bold">Experience Gained</Text>}
          {currentCategory === 'streaks' && <Text fontWeight="bold">Streaks</Text>}
          {currentCategory === 'questsCompleted' && <Text fontWeight="bold">Quests Completed</Text>}
        </XStack>

        {selectedData.map((user, index) => (
          <XStack
            key={index}
            justifyContent="space-between"
            padding={15}
            backgroundColor={user.name === currentUserName ? '#d1f5d3' : '#fff'} 
            borderRadius={10}
            marginBottom={10}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 }, 
              shadowOpacity: 0.1, 
              shadowRadius: 10, 
            }}
          >
            <Text>{index + 1}</Text>
            <Text>{user.name}</Text>
            {currentCategory === 'totalExp' && <Text>{user.totalExp}</Text>}
            {currentCategory === 'streaks' && <Text>{user.streaks}</Text>}
            {currentCategory === 'questsCompleted' && <Text>{user.questsCompleted}</Text>}
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}
