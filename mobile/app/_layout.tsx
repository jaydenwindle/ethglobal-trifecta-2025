import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { createTamagui, TamaguiProvider, View, Text, Button, H3, YStack, TextArea, Label, XStack, Spinner } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

const config = createTamagui(defaultConfig)

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <StatusBar style="auto" />

      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="attest"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>

    </TamaguiProvider>
  );
}
