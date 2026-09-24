import 'react-native-reanimated';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import {
  IBMPlexSans_400Regular,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';

import {
  IBMPlexMono_400Regular,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';

import { GamesStoreProvider } from '@/context/GamesStore';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GamesStoreProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="game/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="game/new"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="person/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="mark-lab"
          options={{ headerShown: false }}
        />
      </Stack>
    </GamesStoreProvider>
  );
}
