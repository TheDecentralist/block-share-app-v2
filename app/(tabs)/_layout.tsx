// Block Share App v2.0 - Tab Layout
// 4 simplified tabs: Home, Stuff, Food, Me

import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Home, Package, UtensilsCrossed, User } from 'lucide-react-native';
import { COLORS, SECTION_COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarActiveTintColor: SECTION_COLORS.home.primary,
          headerStyle: { backgroundColor: SECTION_COLORS.home.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '700' },
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="stuff"
        options={{
          title: 'Stuff',
          tabBarActiveTintColor: SECTION_COLORS.stuff.primary,
          headerStyle: { backgroundColor: SECTION_COLORS.stuff.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '700' },
          tabBarIcon: ({ color, size }) => (
            <Package size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: 'Food',
          tabBarActiveTintColor: SECTION_COLORS.food.primary,
          headerStyle: { backgroundColor: SECTION_COLORS.food.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '700' },
          tabBarIcon: ({ color, size }) => (
            <UtensilsCrossed size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarActiveTintColor: SECTION_COLORS.me.primary,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 85,
    paddingBottom: 25,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
