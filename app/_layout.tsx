import { AppProvider } from '@/hooks/AppContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="pedidos" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}