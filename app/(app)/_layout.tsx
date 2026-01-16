import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { ComponentProps, useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/src/components/Header';
import { MyText } from '@/src/components/ThemedText';
import { supabase } from '@/src/lib/supabase';
import ActiveSummaryScreen from './index';
import SettingsScreen from './settings';

const Tab = createMaterialTopTabNavigator();

// Placeholder para pantallas en desarrollo
const Placeholder = ({ name }: { name: string }) => (
  <View style={styles.placeholderContainer}>
    <MyText>{name}</MyText>
  </View>
);

function TabNavigator({ avatarUrl }: { avatarUrl: string | null }) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      {/* Componente Header independiente */}
      <Header avatarUrl={avatarUrl} />

      <Tab.Navigator
        initialRouteName="index" // Forzamos el inicio en la pantalla index
        tabBarPosition="bottom"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#f80000',
          tabBarInactiveTintColor: isDark ? '#888' : '#666',
          tabBarIndicatorStyle: { backgroundColor: '#f80000', height: 3 },
          tabBarStyle: {
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
            textTransform: 'none',
          },
          tabBarIcon: ({ color }) => {
            let iconName: ComponentProps<typeof Ionicons>['name'];
            switch (route.name) {
              case 'index':
                iconName = 'home-outline';
                break;
              case 'Libretos':
                iconName = 'book-outline';
                break;
              case 'Elenco':
                iconName = 'people-outline';
                break;
              case 'Escena':
                iconName = 'videocam-outline';
                break;
              case 'Ajustes':
                iconName = 'settings-outline';
                break;
              default:
                iconName = 'help-circle-outline';
            }
            return <Ionicons name={iconName} size={20} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Libretos">
          {() => <Placeholder name="Mis Libretos" />}
        </Tab.Screen>

        <Tab.Screen name="Elenco">
          {() => <Placeholder name="En elenco" />}
        </Tab.Screen>

        <Tab.Screen
          name="index"
          component={ActiveSummaryScreen}
          options={{ title: 'Inicio' }}
        />

        <Tab.Screen name="Escena">
          {() => <Placeholder name="En Escena" />}
        </Tab.Screen>

        <Tab.Screen
          name="Ajustes"
          component={SettingsScreen}
          options={{ title: 'Ajustes' }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default function AppLayout() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any;

    const setupAuthAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 1. Obtener avatar inicial
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (data?.avatar_url) setAvatarUrl(data.avatar_url);

        // 2. Suscribirse a cambios en tiempo real
        subscription = supabase
          .channel('profile-header-changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              if (payload.new.avatar_url) {
                setAvatarUrl(payload.new.avatar_url);
              }
            }
          )
          .subscribe();
      }
    };

    setupAuthAndProfile();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <TabNavigator avatarUrl={avatarUrl} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
