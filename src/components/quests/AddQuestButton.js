import React, { useState } from 'react';
import { YStack, Button, Text, Dialog, DialogContent, ScrollView, XStack, Unspaced } from 'tamagui';
import { X } from '@tamagui/lucide-icons';
import AddQuestForm from './AddQuestForm';

export default function AddQuestButton() {
  const [dialogOpen, setDialogOpen] = useState(false); 

  return (
    <>
      <Button
        style={{
          position: 'absolute',
          bottom: 40, 
          left: '50%',
          transform: [{ translateX: -30 }], 
          backgroundColor: '#ff6347',
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10, 
        }}
        onPress={() => setDialogOpen(true)} 
      >
        <Text style={{ color: 'white', fontSize: 30 }}>+</Text> 
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            animation="slow"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <DialogContent
            bordered
            elevate
            key="content"
            animation={[
              'quicker',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
            width="90%"
            maxWidth={500}
            alignSelf="center"
            top="50%"
            position="absolute"
            transform={[{ translateY: -150 }]} 
            maxHeight="80%"
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <YStack space="$4" width="100%" alignItems="flex-start">
                <Text fontSize={18} marginBottom={20}>Add New Quest</Text>

                <AddQuestForm onClose={() => setDialogOpen(false)} />

                <XStack alignSelf="flex-end" gap="$4">
                  <Dialog.Close asChild>
                    <Button theme="dark" marginTop={10}>
                      <Text>Close</Text>
                    </Button>
                  </Dialog.Close>
                </XStack>

                <Unspaced>
                  <Dialog.Close asChild>
                    <Button
                      position="absolute"
                      top="$3"
                      right="$3"
                      size="$2"
                      circular
                      icon={X}
                    />
                  </Dialog.Close>
                </Unspaced>
              </YStack>
            </ScrollView>
          </DialogContent>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
