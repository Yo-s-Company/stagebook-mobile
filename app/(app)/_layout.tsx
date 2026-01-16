import { MyText } from '@/src/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActiveSummaryScreen from './index';
import SettingsScreen from './settings';

const Tab = createMaterialTopTabNavigator();

// Placeholder nativo sin Tailwind
const Placeholder = ({ name }: { name: string }) => (
  <View style={styles.placeholderContainer}>
    <MyText>{name}</MyText>
  </View>
);

export default function AppLayout() {
  const insets = useSafeAreaInsets(); 

  return (
    <Tab.Navigator
      initialRouteName="index" 
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarLabelStyle: { 
          fontSize: 8, 
          fontWeight: 'bold', 
          textTransform: 'uppercase',
          marginBottom: 5 
        },
        tabBarStyle: { 
          backgroundColor: '#000000',
          borderTopWidth: 1, 
          borderTopColor: '#27272a',
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10, 
          height: 65 + (insets.bottom > 0 ? insets.bottom : 10) 
        },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#71717a',
        tabBarIndicatorStyle: { backgroundColor: '#7C3AED', top: 0 },
        tabBarIcon: ({ color }) => {
          let iconName: any;
          // Mapeo de iconos basado en el "name" de Tab.Screen
          if (route.name === 'Libretos') iconName = 'journal';
          else if (route.name === 'Elenco') iconName = 'people';
          else if (route.name === 'index') iconName = 'happy-outline';
          else if (route.name === 'Escena') iconName = 'videocam';
          else if (route.name === 'Ajustes') iconName = 'settings';
          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      
      <Tab.Screen name="Libretos" component={() => <Placeholder name="Mis Libretos" />} />
      <Tab.Screen name="Elenco" component={() => <Placeholder name="En elenco" />} />

      <Tab.Screen 
        name="index" 
        component={ActiveSummaryScreen} 
        options={{ title: 'Inicio' }}
      />
      
      <Tab.Screen name="Escena" component={() => <Placeholder name="En Escena" />} />
      
      <Tab.Screen 
        name="Ajustes"        
        component={SettingsScreen} 
        options={{ title: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    backgroundColor: '#000', 
    justifyContent: 'center',
    alignItems: 'center'
  }
});