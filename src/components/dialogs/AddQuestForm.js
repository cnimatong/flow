import React, { useState } from 'react';
import { YStack, XStack, Input, Button, ToggleGroup, Label, Text, AlertDialog } from 'tamagui';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import useQuestStore from '../../store/questStore';

export default function AddQuestForm({ onClose }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Daily');  
  const [importance, setImportance] = useState(1);
  const [dueDate, setDueDate] = useState(new Date());
  const [showAlertDialog, setShowAlertDialog] = useState(false);  
  const [showDatePicker, setShowDatePicker] = useState(false);   
  const addQuest = useQuestStore((state) => state.addQuest);

  // Handle form validation
  const isFormValid = name && category && importance && dueDate;

  const handleAddQuest = () => {
    if (!isFormValid) {
      setShowAlertDialog(true);
      return;
    }

    const localDate = new Date(dueDate.getTime() - dueDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];  

    const newQuest = {
      id: Date.now(),  
      name,
      category,
      importance,
      dueDate: localDate,  
      completed: false,
    };
    addQuest(newQuest);
    onClose();
  };

  // Handler for date picker value changes
  const onChangeDate = (event, selectedDate) => {
    if (event.type === "set") {  
      const currentDate = selectedDate || dueDate;
      setDueDate(currentDate);  
    }
  };

  return (
    <YStack marginTop={20} space>
      <Input
        placeholder="Quest Name"
        value={name}
        onChangeText={setName}
        backgroundColor="#f9f9f9"
        borderRadius={6}
        padding={10}
        marginBottom={15}
        fontSize={16}
        borderColor="#ddd"
        borderWidth={1}
      />

      {/* Category Toggle Group */}
      <Text fontWeight="bold" marginBottom={10}>Category</Text>
      <XStack alignItems="center" space marginBottom={15}>
        <Label paddingRight="$2" size="$3">Select Category</Label>
        <ToggleGroup
          type="single"
          size="$4"
          value={category}
          onValueChange={setCategory}
          borderRadius={8}
          backgroundColor="#f0f0f0"
        >
          <ToggleGroup.Item value="Daily">
            <Text>Daily</Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="Weekly">
            <Text>Weekly</Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="Special">
            <Text>Special</Text>
          </ToggleGroup.Item>
        </ToggleGroup>
      </XStack>

      {/* Importance Toggle Group */}
      <Text fontWeight="bold" marginBottom={10}>Importance</Text>
      <XStack alignItems="center" space marginBottom={15}>
        <Label paddingRight="$2" size="$3">Select Importance</Label>
        <ToggleGroup
          type="single"
          size="$4"
          value={importance}
          onValueChange={(value) => setImportance(Number(value))}
          borderRadius={8}
          backgroundColor="#f0f0f0"
        >
          <ToggleGroup.Item value={1}>
            <Text>Low</Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item value={2}>
            <Text>Medium</Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item value={3}>
            <Text>High</Text>
          </ToggleGroup.Item>
        </ToggleGroup>
      </XStack>

      {/* Due Date Picker */}
      <Text fontWeight="bold" marginBottom={10}>Due Date</Text>
      <Button onPress={() => setShowDatePicker(true)} backgroundColor="#f9f9f9" borderColor="#ddd" borderWidth={1} borderRadius={6}>
        <Text>{dueDate.toDateString()}</Text>
      </Button>

      {/* Only show DateTimePicker when triggered */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      {/* Add Quest Button */}
      <Button onPress={handleAddQuest} marginTop={20} backgroundColor="#3498db" paddingVertical={12} borderRadius={8}>
        <Text color="#fff" fontWeight="bold">Add Quest</Text>
      </Button>

      {/* Alert Dialog for Form Validation */}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay key="alert-dialog-overlay" />
          <AlertDialog.Content
            key="alert-dialog-content"
            elevate
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack space>
              <AlertDialog.Title>Form Incomplete</AlertDialog.Title>
              <AlertDialog.Description>
                Please fill in all fields before adding the quest.
              </AlertDialog.Description>

              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Action asChild>
                  <Button theme="active" onPress={() => setShowAlertDialog(false)}>OK</Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
}
