import { Tabs } from "expo-router";
import { Home, Star, Building, Search, Users } from "lucide-react-native";
import Colors from "@/constants/Colors";

const tintColorLight = Colors.light.tint;
const tintColorDark = Colors.dark.tint;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tintColorLight,
        tabBarLabelStyle: {
          fontFamily: "mon-sb",
        },
        tabBarStyle: {
          paddingBottom: 10,
          height: 65,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="essentials"
        options={{
          title: "Essentials",
          tabBarIcon: ({ color }) => <Star size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="campus"
        options={{
          title: "Campus",
          tabBarIcon: ({ color }) => <Building size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: "Network",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
