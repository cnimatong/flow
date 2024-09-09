import React, { useState, useEffect } from 'react';
import { YStack, ScrollView } from 'tamagui';
import CalendarHeader from '../src/components/quests/CalendarHeader';
import DateSelector from '../src/components/quests/DateSelector';
import TaskSchedule from '../src/components/quests/TaskSchedule';
import useQuestStore from '../src/store/questStore';

const Calendar = () => {
  const today = new Date().toISOString().split('T')[0];  
  const [selectedDate, setSelectedDate] = useState(today);  
  const getQuestsForDate = useQuestStore((state) => state.getQuestsForDate);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  
  useEffect(() => {
    const tasks = getQuestsForDate(selectedDate); 
    setTasksForSelectedDate(tasks);  
  }, [selectedDate, getQuestsForDate]);

  return (
    <YStack flex={1} backgroundColor="#f5f5f5">
      <YStack height={80}>
        <CalendarHeader />
      </YStack>

      <YStack height={100}>
        <DateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </YStack>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }} 
        showsVerticalScrollIndicator={false} 
      >
        <YStack flex={1}>
          <TaskSchedule selectedDate={selectedDate} tasks={tasksForSelectedDate} />
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default Calendar;
