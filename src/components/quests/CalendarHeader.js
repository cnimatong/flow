import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import useQuestStore from '../../store/questStore';  

export default function CalendarHeader() {
  const [todayQuests, setTodayQuests] = useState(0);
  const quests = useQuestStore((state) => state.quests);  

  useEffect(() => {
    if (quests && Array.isArray(quests)) {
      const today = new Date().toISOString().split('T')[0];  

      const todayQuestsCount = quests.filter((quest) => quest.dueDate === today).length;
      setTodayQuests(todayQuestsCount);  
    }
  }, [quests]);  

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }); 

  return (
    <YStack padding={20}>
      <XStack justifyContent="space-between" alignItems="center">
        <YStack>
          <Text fontSize={24} fontWeight="bold">{currentMonth}</Text>
          <Text fontSize={16} color="#999">{todayQuests} Quests Today</Text>
        </YStack>
        <Image
          source={{ uri: 'https://your-avatar-url.com/avatar.png' }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </XStack>
    </YStack>
  );
};
