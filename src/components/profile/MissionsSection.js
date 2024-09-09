import React, { useEffect } from 'react';
import { YStack, Text, Progress, XStack } from 'tamagui';
import useQuestStore from '../../store/questStore';

export default function MissionsSection() {
  const dailyMissionProgress = useQuestStore((state) => state.dailyMissionProgress);
  const weeklyMissionProgress = useQuestStore((state) => state.weeklyMissionProgress);

  useEffect(() => {
  }, [dailyMissionProgress, weeklyMissionProgress]);

  const getProgressColor = (progress, max) => {
    return progress >= max ? '#4CAF50' : '#3498db'; 
  };

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
      width="90%"               
    >
      <Text fontSize={18} fontWeight="bold" marginBottom={10}>Missions</Text>

      {/* Daily Mission */}
      <YStack marginBottom={20} width="100%">
        <XStack justifyContent="space-between" alignItems="center" marginBottom={5}>
          <Text fontSize={16} fontWeight="semi-bold">Daily: Complete 1 Quest</Text>
          <Text fontSize={12} color="#999" textAlign="center">
            {dailyMissionProgress >= 1 ? 'Completed' : `${dailyMissionProgress} / 1 Quest`}
          </Text>
        </XStack>

        <Progress size="$4" value={(dailyMissionProgress / 1) * 100} max={100} width="100%">
          <Progress.Indicator
            animation="bouncy"
            backgroundColor={getProgressColor(dailyMissionProgress, 1)}
          />
        </Progress>
      </YStack>

      {/* Weekly Mission */}
      <YStack marginBottom={20} width="100%">
        <XStack justifyContent="space-between" alignItems="center" marginBottom={5}>
          <Text fontSize={16} fontWeight="semi-bold">Weekly: Complete 7 Quests</Text>
          <Text fontSize={12} color="#999" textAlign="center">
            {weeklyMissionProgress >= 7 ? 'Completed' : `${weeklyMissionProgress} / 7 Quests`}
          </Text>
        </XStack>

        <Progress size="$4" value={(weeklyMissionProgress / 7) * 100} max={100} width="100%">
          <Progress.Indicator
            animation="bouncy"
            backgroundColor={getProgressColor(weeklyMissionProgress, 7)}
          />
        </Progress>
      </YStack>
    </YStack>
  );
}
