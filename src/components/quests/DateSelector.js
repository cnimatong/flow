import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Pressable, Dimensions } from 'react-native';
import { XStack, Text, Button, YStack } from 'tamagui';

const getWeekDays = (weekOffset = 0) => {
  const now = new Date();
  const dayOfWeek = now.getDay();  

  const diffToMonday = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMonday + weekOffset * 7); 

  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i); 

    const day = currentDay.toLocaleString('default', { weekday: 'short' }); 
    const date = currentDay.toLocaleDateString('en-CA');  

    days.push({ day, date });
  }
  return days;
};

export default function DateSelector({ selectedDate, onDateSelect }) {
  const [weekOffset, setWeekOffset] = useState(0); 
  const [days, setDays] = useState([]);
  const scrollViewRef = useRef(null); 
  const itemRefs = useRef([]); 

  useEffect(() => {
    const weekDays = getWeekDays(weekOffset);  
    setDays(weekDays);
  }, [weekOffset]);  

  useEffect(() => {
    const selectedIndex = days.findIndex((day) => day.date === selectedDate);
    
    if (selectedIndex !== -1 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].measureLayout(
        scrollViewRef.current,
        (x, y, width, height) => {
          scrollViewRef.current.scrollTo({
            x: x - (Dimensions.get('window').width / 2) + width / 2, 
            animated: true,
          });
        }
      );
    }
  }, [selectedDate, days]);

  return (
    <YStack alignItems="center">
      <XStack justifyContent="space-between" width="100%" marginBottom={10}>
        {/* Button to go to the previous week */}
        <Button size="$2" onPress={() => setWeekOffset((prev) => prev - 1)}>Previous Week</Button>

        {/* Button to go to the next week */}
        <Button size="$2" onPress={() => setWeekOffset((prev) => prev + 1)}>Next Week</Button>
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 70 }}
        ref={scrollViewRef} 
      >
        <XStack paddingVertical={0} paddingHorizontal={5}>
          {days.map((dayInfo, index) => (
            <Pressable
              key={index}
              ref={(ref) => (itemRefs.current[index] = ref)} 
              onPress={() => onDateSelect(dayInfo.date)} 
              style={{
                height: 50,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: dayInfo.date === selectedDate ? '#2980b9' : '#fff',  
                borderRadius: 20,
                marginHorizontal: 5,
              }}
            >
              <Text color={dayInfo.date === selectedDate ? '#fff' : '#999'}>{dayInfo.day}</Text>
              <Text fontSize={16} fontWeight="bold" color={dayInfo.date === selectedDate ? '#fff' : '#333'}>
                {dayInfo.date.split('-')[2]}
              </Text>
            </Pressable>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
