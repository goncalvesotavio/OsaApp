import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Configuração para a tela de início (index.tsx) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Adicionamos esta linha para a tela de pedidos (pedidos.tsx) */}
      <Stack.Screen name="pedidos" options={{ headerShown: false }} />
    </Stack>
  );
}