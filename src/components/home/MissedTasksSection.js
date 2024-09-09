import { YStack, XStack, Text, Checkbox } from 'tamagui';
import { Check as CheckIcon } from '@tamagui/lucide-icons';
import useQuestStore from '../../store/questStore';
import { useAuthStore } from '../../store/useAuthStore'; 
import { useEffect, useState } from 'react';

// Function to return color based on importance
const getImportanceColor = (importance) => {
  switch (importance) {
    case 1:
      return '#2ecc71';  
    case 2:
      return '#f1c40f';  
    case 3:
      return '#e74c3c';  
    default:
      return '#ddd';      
  }
};

// Function to return category colors for Daily, Weekly, Special
const getCategoryColor = (category) => {
  switch (category) {
    case 'Daily':
      return { color: '#3498db', backgroundColor: '#eaf4fb' };
    case 'Weekly':
      return { color: '#e67e22', backgroundColor: '#fdf2e3' }; 
    case 'Special':
      return { color: '#9b59b6', backgroundColor: '#f4eafc' }; 
    default:
      return { color: '#333', backgroundColor: '#ddd' }; 
  }
};

const MissedTasksSection = () => {
  const quests = useQuestStore((state) => state.quests); 
  const getMissedQuests = useQuestStore((state) => state.getMissedQuests);
  const [missedTasks, setMissedTasks] = useState([]);
  const completeQuest = useQuestStore((state) => state.completeQuest);
  const gainExperience = useAuthStore((state) => state.gainExperience);

  useEffect(() => {
    const filteredMissedQuests = getMissedQuests();
    setMissedTasks(filteredMissedQuests);
  }, [quests]);  

  const handleCompleteTask = (id, importance) => {
    completeQuest(id);  

    let xpGained = 0;
    if (importance === 1) xpGained = 5;
    if (importance === 2) xpGained = 10;
    if (importance === 3) xpGained = 20;

    gainExperience(xpGained);
  };

  return (
    <YStack paddingVertical={0}>
      <Text fontSize={12} fontWeight="bold" marginBottom={5}>
        Missed Tasks
      </Text>
      {missedTasks.map((task) => (
        <YStack
          key={task.id}
          marginBottom={10}
          padding={12} 
          borderRadius={8} 
          borderLeftWidth={4} 
          borderLeftColor={getImportanceColor(task.importance)} 
          backgroundColor="#ffe6e6"  
          shadowColor="#000"
          shadowOpacity={0.1}
          shadowRadius={3} 
        >
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              {/* Task Name and Due Date */}
              <Text fontSize={14} fontWeight="bold" color="#333">
                {task.name || 'Untitled Task'}
              </Text>
              <Text fontSize={12} fontWeight="bold" color="#e74c3c">
                Due: {task.dueDate}
              </Text>
            </YStack>

            {/* Task Category and Checkbox */}
            <XStack alignItems="center" gap="$2">
              <YStack
                paddingVertical={3}
                paddingHorizontal={6}
                borderRadius={6}
                backgroundColor={getCategoryColor(task.category || 'unknown').backgroundColor}
              >
                <Text fontSize={10} color={getCategoryColor(task.category || 'unknown').color}>
                  {task.category ? task.category.charAt(0).toUpperCase() + task.category.slice(1) : 'Unknown'}
                </Text>
              </YStack>

              <Checkbox
                id={`checkbox-${task.id || task.name}-${Math.random()}`} 
                size="$2" 
                checked={task.completed}
                onCheckedChange={() => handleCompleteTask(task.id, task.importance)}
              >
                <Checkbox.Indicator>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox>


            </XStack>
          </XStack>
        </YStack>
      ))}
    </YStack>
  );
};

export default MissedTasksSection;
