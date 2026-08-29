import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'ProxiJournal',
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: 'Create Note',
        }}
      />

      <Stack.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />

      <Stack.Screen
        name="note/[id]"
        options={{
          title: 'Note',
        }}
      />
    </Stack>
  );
}