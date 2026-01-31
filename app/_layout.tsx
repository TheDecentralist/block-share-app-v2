// Block Share App v2.0 - Root Layout
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { COLORS } from '@/constants/theme';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="item/[id]" 
          options={{ 
            title: 'Item Details',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="host/apply" 
          options={{ 
            title: 'Become a Host',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="host/training" 
          options={{ 
            title: 'Host Training',
          }} 
        />
        <Stack.Screen 
          name="host/training/[moduleId]" 
          options={{ 
            title: 'Training Module',
          }} 
        />
        <Stack.Screen 
          name="host/broadcast" 
          options={{ 
            title: 'Send Announcement',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="host/residents" 
          options={{ 
            title: 'Building Residents',
          }} 
        />
        <Stack.Screen 
          name="food/subscribe" 
          options={{ 
            title: 'Join Collective',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="food/give-or-get" 
          options={{ 
            title: 'Give or Get',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="vote/[id]" 
          options={{ 
            title: 'Vote',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="chat/[id]" 
          options={{ 
            title: 'Chat',
          }} 
        />
      </Stack>
    </>
  );
}
