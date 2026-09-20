import { Tabs } from 'expo-router';
import { colors } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.bone,
        },
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.bone,
          borderTopColor: colors.concrete,
          borderTopWidth: 1,
          height: 82,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Play' }}
      />
      <Tabs.Screen
        name="games"
        options={{ title: 'Games' }}
      />
      <Tabs.Screen
        name="journal"
        options={{ title: 'Journal' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}
