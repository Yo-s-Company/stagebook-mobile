import React, { useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Importante
import { ProfileHeader } from "./ProfileHeader";
import { EditProfileModal } from "./ProfileModal";
import { ProfileTabs } from "./ProfileTabs";

export default function PerfilScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets(); // Obtiene los márgenes del notch y la base

  const theme = {
    bg: isDark ? '#121212' : '#F4F4F5',
    text: isDark ? '#FFFFFF' : '#18181b',
    primary: '#7C3AED',
    secondary: '#dc2626'
  };

  const [activeTab, setActiveTab] = useState('book');
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const [userData] = useState({
    displayName: "Tu Nombre Artístico",
    artisticName: "usuario_pro",
    description: "Actor y modelo profesional.",
    birthPlace: "Madrid, España",
    age: "28"
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
    <View style={{ height: insets.top }} />
      <View style={{ paddingTop: insets.top }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        // El contentContainerStyle permite añadir margen al final del scroll
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <ProfileHeader 
          userData={userData} 
          theme={theme} 
          onEdit={() => setEditModalVisible(true)} 
        />
        
        <View style={styles.separator} />
        
        <ProfileTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme} 
        />

        {/* Aquí iría el contenido de las pestañas */}
      </ScrollView>

      <EditProfileModal 
        visible={isEditModalVisible} 
        onClose={() => setEditModalVisible(false)} 
        currentData={userData}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  separator: { 
    height: 1, 
    backgroundColor: 'rgba(113, 113, 122, 0.2)', 
    marginVertical: 15, 
    width: '90%', 
    alignSelf: 'center' 
  }
});