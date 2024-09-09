import React, { useEffect } from 'react';
import { YStack, XStack, Text, Card, TooltipSimple } from 'tamagui';
import { useWindowDimensions } from 'react-native';
import useQuestStore from '../../store/questStore'; 
import { CheckCircle, Lock } from '@tamagui/lucide-icons';

export default function AchievementsSection() {
  const { questCount, streak, dailyMissionProgress, weeklyMissionProgress, achievements, checkAchievements } = useQuestStore((state) => ({
    questCount: state.questCount || 0,
    streak: state.streak || 0,
    dailyMissionProgress: state.dailyMissionProgress || 0,
    weeklyMissionProgress: state.weeklyMissionProgress || 0,
    achievements: state.achievements || {},
    checkAchievements: state.checkAchievements,
  }));

  const { width } = useWindowDimensions();

  useEffect(() => {
    checkAchievements(); 
  }, [questCount, streak, dailyMissionProgress, weeklyMissionProgress, checkAchievements]);

  const achievementTitles = {
    questAchievements: [
      { title: 'Complete 1 Quest', requirement: 'Complete your first quest' },
      { title: 'Complete 5 Quests', requirement: 'Complete 5 quests' },
      { title: 'Complete 10 Quests', requirement: 'Complete 10 quests' },
    ],
    streakAchievements: [
      { title: '1 Day Streak', requirement: 'Complete tasks for 1 day in a row' },
      { title: '4 Day Streak', requirement: 'Complete tasks for 4 days in a row' },
      { title: '7 Day Streak', requirement: 'Complete tasks for 7 days in a row' },
    ],
    challengeAchievements: [
      { title: 'Complete 1 Daily Challenge', requirement: 'Complete your first daily challenge' },
      { title: 'Complete 3 Daily Challenges', requirement: 'Complete 3 daily challenges' },
      { title: 'Complete 1 Weekly Challenge', requirement: 'Complete a weekly challenge' },
    ],
  };

  const checkUnlocked = (title) => achievements[title];

  const renderAchievements = (type) => (
    <>
      {achievementTitles[type].map((achievement, index) => (
        <TooltipSimple
          key={index}
          label={`${achievement.title}: ${achievement.requirement}`}
          placement="top"
        >
          <Card
            padding={12}
            width={160}
            marginBottom={16}
            borderRadius={12}
            elevate
            backgroundColor="white" 
            shadowColor="#000"       
            shadowOffset={{ width: 0, height: 4 }}  
            shadowOpacity={0.1}       
            shadowRadius={8}          
          >
            <YStack alignItems="center">
              {checkUnlocked(achievement.title) ? (
                <CheckCircle size={40} color="#4CAF50" />
              ) : (
                <Lock size={40} color="#B0BEC5" />
              )}
              <Text
                fontSize={14}
                fontWeight={checkUnlocked(achievement.title) ? 'bold' : 'normal'}
                color={checkUnlocked(achievement.title) ? '#4CAF50' : '#757575'}
                marginTop={8}
                textAlign="center"
              >
                {achievement.title}
              </Text>
            </YStack>
          </Card>
        </TooltipSimple>
      ))}
    </>
  );

  const getColumns = () => {
    if (width < 500) return 1; 
    if (width > 1000) return 3; 
    return 2; 
  };

  const columns = getColumns();

  return (
    <YStack
      paddingVertical={24}
      paddingHorizontal={16}
      backgroundColor="white"  
      borderRadius={12}         
      shadowColor="#000"       
      shadowOffset={{ width: 0, height: 4 }}  
      shadowOpacity={0.1}      
      shadowRadius={10}         
      marginHorizontal={16}     
      marginVertical={10}      
      alignItems="center" 
    >
      <Text fontSize={22} fontWeight="bold" marginBottom={20} color="#333">
        Achievements
      </Text>

      <XStack
        flexWrap="wrap"
        justifyContent={columns === 1 ? 'center' : 'space-between'} 
      >
        <YStack
          flexDirection="row"
          flexWrap="wrap"
          justifyContent={columns === 1 ? 'center' : 'space-around'}
        >
          <YStack width={columns === 1 ? '100%' : `${100 / columns}%`} alignItems={columns === 1 ? 'center' : 'stretch'}>
            {renderAchievements('questAchievements')}
          </YStack>
          <YStack width={columns === 1 ? '100%' : `${100 / columns}%`} alignItems={columns === 1 ? 'center' : 'stretch'}>
            {renderAchievements('streakAchievements')}
          </YStack>
          <YStack width={columns === 1 ? '100%' : `${100 / columns}%`} alignItems={columns === 1 ? 'center' : 'stretch'}>
            {renderAchievements('challengeAchievements')}
          </YStack>
        </YStack>
      </XStack>

      <Text fontSize={14} marginTop={24} color="#999">
        More Achievements on the way...
      </Text>
    </YStack>
  );
}
