import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { YStack, XStack, Checkbox, Label, AlertDialog, Button } from 'tamagui';
import useQuestStore from '../../store/questStore';
import useAuthStore from '../../store/useAuthStore';
import { Check as CheckIcon } from '@tamagui/lucide-icons';

// Function to get border color based on importance level
const getTaskBorderColor = (importance) => {
  switch (importance) {
    case 1:
      return '#2ecc71';  // Green for low importance
    case 2:
      return '#f1c40f';  // Yellow for medium importance
    case 3:
      return '#e74c3c';  // Red for high importance
    default:
      return '#ddd';  // Default color
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

export default function TaskSchedule({ selectedDate }) {
  const quests = useQuestStore((state) => state.quests);  
  const completeQuest = useQuestStore((state) => state.completeQuest);  
  const unmarkQuest = useQuestStore((state) => state.unmarkQuest); 
  const getQuestsForDate = useQuestStore((state) => state.getQuestsForDate);

  const gainExperience = useAuthStore((state) => state.gainExperience);  
  const loseExperience = useAuthStore((state) => state.loseExperience);

  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [questToUnmark, setQuestToUnmark] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      const filteredQuests = getQuestsForDate(selectedDate);
      const incomplete = filteredQuests.filter((task) => !task.completed);
      const completed = filteredQuests.filter((task) => task.completed);

      setIncompleteTasks(incomplete);
      setCompletedTasks(completed);
    }
  }, [selectedDate, quests]);  

  const handleCompleteTask = (id, importance) => {
    completeQuest(id);  

    let xpGained = 0;
    if (importance === 1) xpGained = 5;
    if (importance === 2) xpGained = 10;
    if (importance === 3) xpGained = 20;

    gainExperience(xpGained);
  };

  const handleUnmarkTask = (id) => {
    setQuestToUnmark(id);  
    setDialogOpen(true);  
  };

  const confirmUnmarkTask = () => {
    if (questToUnmark) {
      const quest = quests.find(q => q.id === questToUnmark);  

      if (quest) {
        let xpLost = 0;

        if (quest.importance === 1) xpLost = 5;
        if (quest.importance === 2) xpLost = 10;
        if (quest.importance === 3) xpLost = 20;

        loseExperience(xpLost);

        unmarkQuest(questToUnmark);  
        setDialogOpen(false);  
        setQuestToUnmark(null);  
      }
    }
  };

  return (
    <YStack padding={10}>
      {incompleteTasks.length > 0 ? (
        <>
          <Text style={{ fontSize: 12, marginBottom: 10 }}>Incomplete Quests</Text>
          {incompleteTasks.map((task) => (
            <YStack
              key={`task-${task.id}`}  
              marginBottom={10} 
              padding={10} 
              style={{
                backgroundColor: '#fff', 
                borderRadius: 8,  
                borderLeftWidth: 4,  
                borderLeftColor: getTaskBorderColor(task.importance),  
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,  
              }}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  {/* Task Name and Due Date */}
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
                    {task.name || 'Untitled Task'}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>
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

                  {/* Checkbox to mark task as complete */}
                  <Checkbox
                    id={`checkbox-${task.id}`}  
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
        </>
      ) : (
        <Text>No Incomplete Quests for this date.</Text>
      )}

      {/* Render Completed Tasks */}
      {completedTasks.length > 0 && (
        <>
          <Text style={{ fontSize: 12, marginTop: 20, marginBottom: 10 }}>Completed Quests</Text>
          {completedTasks.map((task) => (
            <YStack
              key={`completed-task-${task.id}`} 
              marginBottom={10}  
              padding={10} 
              style={{
                backgroundColor: '#eee',  
                borderRadius: 8,  
                borderLeftWidth: 4,  
                borderLeftColor: '#ccc', 
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4, 
              }}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  {/* Task Name and Due Date */}
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#999' }}>
                    {task.name || 'Untitled Task'}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#999' }}>
                    Due: {task.dueDate}
                  </Text>
                </YStack>

                {/* Checked Checkbox for completed tasks */}
                <XStack alignItems="center" gap="$2">
                  <Checkbox
                    id={`checkbox-complete-${task.id}`}  
                    size="$2"
                    checked={task.completed}
                    onCheckedChange={() => handleUnmarkTask(task.id)}  
                  >
                    <Checkbox.Indicator>
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox>
                </XStack>
              </XStack>
            </YStack>
          ))}
        </>
      )}

      {/* Alert Dialog for Unmarking a Task */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen} onDismiss={() => setDialogOpen(false)} key={`alert-dialog-${questToUnmark}`}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay key="overlay" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }} onPress={() => setDialogOpen(false)} />

          <AlertDialog.Content key={`content-${questToUnmark}`} style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000', 
            shadowOpacity: 0.25, 
            shadowOffset: { width: 0, height: 4 }, 
            shadowRadius: 10, 
            elevation: 5, 
            padding: 20,
            position: 'relative',
            alignSelf: 'center',
            width: '90%', 
          }}>
            <YStack>
              <AlertDialog.Title key={`title-${questToUnmark}`}>Mark Task as Incomplete</AlertDialog.Title>
              <AlertDialog.Description key={`description-${questToUnmark}`}>
                Are you sure you want to mark this task as incomplete?
              </AlertDialog.Description>
              <XStack space="$4" justifyContent="flex-end">
                <AlertDialog.Cancel asChild key={`cancel-${questToUnmark}`}>
                  <Button onPress={() => setDialogOpen(false)}>Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild key={`confirm-${questToUnmark}`}>
                  <Button onPress={confirmUnmarkTask}>Confirm</Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
}
