import React, { useEffect, useState } from 'react';
import { YStack, Text, XStack, Button } from 'tamagui';
import { StackedBarChart } from 'react-native-svg-charts';
import { View } from 'react-native';
import useQuestStore from '../../store/questStore';
import * as scale from 'd3-scale';
import { G, Rect, Text as SvgText } from 'react-native-svg'; 

export default function AnalyticsSection() {
  const { quests } = useQuestStore((state) => state); 
  const [chartData, setChartData] = useState([]);
  const groupTasksByDay = (quests, weekOffset = 0) => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = daysOfWeek.map(() => ({ completed: 0, uncompleted: 0 }));
  
    const today = new Date();
    const currentDayOfWeek = today.getDay(); 
  
    // Calculate the start of the week (Monday) with weekOffset
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1) + (weekOffset * 7));
    startOfWeek.setHours(0, 0, 0, 0); 
  
    // Calculate the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); 
  
    // Filter the quests to include only those within the current week
    const currentWeekQuests = quests.filter((quest) => {
      const questDate = new Date(quest.dueDate);
      return questDate >= startOfWeek && questDate <= endOfWeek;
    });
  
    // Group the quests by day of the week
    currentWeekQuests.forEach((quest) => {
      const taskDay = new Date(quest.dueDate).getDay();
      const dayIndex = taskDay === 0 ? 6 : taskDay - 1; 
      if (quest.completed) {
        data[dayIndex].completed += 1;
      } else {
        data[dayIndex].uncompleted += 1;
      }
    });
  
    return data;
  };
  
  
  const [weekOffset, setWeekOffset] = useState(0);
  

  useEffect(() => {
    const groupedData = groupTasksByDay(quests, weekOffset); 
    setChartData(groupedData); 
  }, [quests, weekOffset]);  

  const BarNumbers = ({ x, y, width, height, data, index }) => (
    <SvgText
      x={x + width / 2}  
      y={y - 5} 
      fontSize="12"
      fill="#333"
      alignmentBaseline="middle"
      textAnchor="middle"
    >
      {data[index].completed} 
    </SvgText>
  );

  // Custom rendering to add rounded corners to bars
  const RoundedBar = ({ x, y, width, height }) => (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#3498db" 
      rx={5} 
      ry={5}
    />
  );

  return (
    <YStack paddingVertical={20} backgroundColor="#f9f9f9" borderRadius={10} paddingHorizontal={10} shadowColor="#000" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.1} shadowRadius={5}>
      <Text fontSize={12} fontWeight="bold" color="grey" marginBottom={5}>Weekly Quest Summary</Text>
      <XStack justifyContent="space-between" marginBottom={10}>
        <Button
          size="$1"             
          backgroundColor="#3498db"
          borderRadius="$4"       
          onPress={() => setWeekOffset(weekOffset - 1)}
          color="$color"          
        >
          Previous Week
        </Button>

        <Button
          size="$1"
          backgroundColor="#3498db"
          borderRadius="$4"
          onPress={() => setWeekOffset(weekOffset + 1)}
          color="$color"
        >
          Next Week
        </Button>
      </XStack>

      <View style={{ height: 150 }}>
        {chartData.length > 0 && (
          <StackedBarChart
            style={{ flex: 1 }}
            data={chartData}
            keys={['completed', 'uncompleted']} 
            colors={['#3498db', '#BDC3C7']} 
            contentInset={{ top: 20, bottom: 10 }} 
            spacingInner={0.4} 
            showGrid={false} 
            xScale={scale.scaleBand}
            yAccessor={({ item }) => item} 
            renderDecorator={({ x, y, width, height, data, index }) => (
              <G>
                <RoundedBar x={x} y={y} width={width} height={height} />
                <BarNumbers x={x} y={y} width={width} height={height} data={data} index={index} />
              </G>
            )}
          />
        )}
        <YStack alignItems="center">
          <YStack
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
            paddingHorizontal={10}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <Text key={index} style={{ fontSize: 12, textAlign: 'center' }}>
                {day}
              </Text>
            ))}
          </YStack>
        </YStack>
      </View>

      <XStack justifyContent="space-around" marginTop={10}>
        <XStack alignItems="center">
          <View style={{ width: 15, height: 15, backgroundColor: '#3498db', marginRight: 5 }} />
          <Text fontSize={10}>Completed</Text> 
        </XStack>
        <XStack alignItems="center">
          <View style={{ width: 15, height: 15, backgroundColor: '#BDC3C7', marginRight: 5 }} />
          <Text fontSize={10}>Incomplete</Text>
        </XStack>
      </XStack>
    </YStack>
  );
}
