import { Tabs } from 'expo-router';

export default function AppTabs() {
return (
<Tabs
screenOptions={{
headerShown: false,
tabBarActiveTintColor: '#4F46E5',
tabBarInactiveTintColor: '#888',
tabBarStyle: {
backgroundColor: '#FFFFFF',
borderTopColor: '#E5E7EB',
height: 60,
},
}}
>
<Tabs.Screen
name="index"
options={{
title: 'Home',
}}
/>


  <Tabs.Screen
    name="explore"
    options={{
      title: 'Explore',
    }}
  />
</Tabs>


);
}
