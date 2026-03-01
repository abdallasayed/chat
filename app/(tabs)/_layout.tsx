import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, tabBarShowLabel: true,
        tabBarStyle: { backgroundColor: '#1E1E1E', borderTopWidth: 0, elevation: 15, height: 65, paddingBottom: 8, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
        tabBarActiveTintColor: '#6C63FF', tabBarInactiveTintColor: '#888',
      }}>
      <Tabs.Screen name="index" options={{ title: 'الرئيسية', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="friends" options={{ title: 'الأصدقاء', tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} /> }} />
      <Tabs.Screen name="split" options={{ title: 'المصاريف', tabBarIcon: ({ color }) => <Ionicons name="wallet" size={24} color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'الدردشة', tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'حسابي', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}
