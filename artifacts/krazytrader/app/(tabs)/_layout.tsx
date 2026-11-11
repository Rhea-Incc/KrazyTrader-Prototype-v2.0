import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Redirect } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useDemoApp } from '@/context/DemoAppContext';

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isLoading, isAuthenticated } = useDemoApp();
  const isWeb = Platform.OS === 'web';
  const tabIcon = (name: React.ComponentProps<typeof Feather>['name']) =>
    ({ focused }: { focused: boolean }) => (
      <Feather name={name} size={21} color={focused ? colors.primary : colors.mutedForeground} />
    );

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/welcome" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 10 },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.card,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          paddingTop: 7,
          ...(isWeb
            ? { height: 84, paddingBottom: 0 }
            : { height: 58 + insets.bottom, paddingBottom: Math.max(insets.bottom, 7) }),
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="membership" options={{ title: 'Membership', tabBarIcon: tabIcon('users') }} />
      <Tabs.Screen name="vehicles" options={{ title: 'Vehicles', tabBarIcon: tabIcon('truck') }} />
      <Tabs.Screen name="benefits" options={{ title: 'Benefits', tabBarIcon: tabIcon('gift') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('user') }} />
    </Tabs>
  );
}
