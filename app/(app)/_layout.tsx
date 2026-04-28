import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { ComponentProps, useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/src/components/Header';
import { supabase } from '@/src/lib/supabase';
import AgendaScreen from './agenda';
import ArchiveScreen from './archive';
import ActiveSummaryScreen from './index';
import LibraryScreen from './library';
import SettingsScreen from './settings';

const Tab = createMaterialTopTabNavigator();

function TabNavigator({ avatarUrl }: { avatarUrl: string | null }) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      {/* Componente Header independiente */}
      <Header avatarUrl={avatarUrl} />

      <Tab.Navigator
        initialRouteName="index" 
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
              case 'library':
                iconName = 'book-outline';
                break;
              case 'archive':
                iconName = 'folder-outline';
                break;
              case 'agenda':
                iconName = 'calendar-outline';
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
        <Tab.Screen
          name="archive"
          component={ArchiveScreen}
          options={{ title: 'Archivo' }}
        />

        <Tab.Screen
          name="agenda"
          component={AgendaScreen}
          options={{ title: 'Agenda' }}
        />


        <Tab.Screen
          name="index"
          component={ActiveSummaryScreen}
          options={{ title: 'Inicio' }}
        />

        <Tab.Screen
          name="library"
          component={LibraryScreen}
          options={{ title: 'Libretos' }}
        />

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
  let isMounted = true; 
  let channel: any;

  const setupAuthAndProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isMounted) return;

    // 1. Obtener avatar inicial
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (data?.avatar_url && isMounted) setAvatarUrl(data.avatar_url);

    // 2. Configurar y Suscribir en un solo bloque fluido
    channel = supabase.channel(`profile_updates_${user.id}`);
      channel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
      (payload: { new: { avatar_url?: string } }) => { 
        if (isMounted && payload.new?.avatar_url) {
          setAvatarUrl(payload.new.avatar_url);
        }
      }
    )
      .subscribe(); 
  };

  setupAuthAndProfile();

  // 🧹 LIMPIEZA ABSOLUTA
  return () => {
    isMounted = false;
    if (channel) supabase.removeChannel(channel);
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
