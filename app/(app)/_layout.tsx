import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as NavigationBar from 'expo-navigation-bar';
import React, { ComponentProps, useEffect, useState } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
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

  if (Platform.OS === 'android') {
  // Solo cambiamos el estilo de los botones (blancos)
  NavigationBar.setButtonStyleAsync('light');
}


  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>  
      <Header avatarUrl={avatarUrl} />

      <Tab.Navigator
        initialRouteName="index" 
        tabBarPosition="bottom"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#f80000',
          tabBarInactiveTintColor: isDark ? '#888' : '#666',
          tabBarIndicatorStyle: { backgroundColor: '#f80000', height: 3,   marginBottom: insets.bottom > 0 ? insets.bottom : 0, },
          tabBarStyle: {
            backgroundColor: '#121212',
            elevation: 0,
            shadowColor: '#000',
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0,
            borderTopWidth: 0,
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      // 1. Obtener avatar inicial
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (data?.avatar_url && isMounted) setAvatarUrl(data.avatar_url);

      // 2. CONFIGURACIÓN DEL CANAL
      const channelName = `profile_updates_${user.id}`;
      supabase.removeChannel(supabase.channel(channelName));

      channel = supabase.channel(channelName);

      channel
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload: any) => {
            if (isMounted && payload.new?.avatar_url) {
              setAvatarUrl(payload.new.avatar_url);
            }
          }
        );
    } catch (error) {
      console.error("Error en setupAuth:", error);
    }
  };

  setupAuthAndProfile();

  return () => {
    isMounted = false;
    if (channel) {
      supabase.removeChannel(channel);
    }
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
