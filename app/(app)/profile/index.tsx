// profile.tsx
import { supabase } from "@/src/lib/supabase";
import { UserProfileData } from "@/src/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileHeader } from "./ProfileHeader";
import { EditProfileModal } from "./ProfileModal";
import { ProfileTabs } from "./ProfileTabs";

export default function PerfilScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets(); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('book');
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const theme = {
    bg: isDark ? '#121212' : '#F4F4F5',
    text: isDark ? '#FFFFFF' : '#18181b',
    primary: '#7C3AED',
    secondary: '#dc2626'
  };

  const [userData, setUserData] = useState<UserProfileData>({
    displayName: "",
    artisticName: "",
    description: "",
    birthPlace: "",
    age: "",
    avatar_url: ""
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserData({
            displayName: data.full_name || "Sin nombre",
            artisticName: data.username || "usuario",
            description: data.bio || "",
            birthPlace: data.location || "",
            age: data.age?.toString() || "",
            avatar_url: data.avatar_url || ""
          });
        }
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdateProfile = async (updatedData: UserProfileData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedData.displayName,
          username: updatedData.artisticName,
          bio: updatedData.description,
          location: updatedData.birthPlace,
          age: parseInt(updatedData.age) || 0
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setUserData(updatedData);
      setEditModalVisible(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo actualizar");
    }
  };

  if (loading) return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: theme.bg}}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Eliminamos el doble padding/height y dejamos solo uno limpio */}
      <View style={{ height: insets.top + 10 }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <ProfileHeader 
          userData={userData} 
          theme={theme} 
          onEdit={() => setEditModalVisible(true)} 
        />
        
        <View style={styles.separator} />
        
        <ProfileTabs 
          activeTab={activeTab as any} 
          setActiveTab={setActiveTab as any} 
          theme={theme} 
        />
      </ScrollView>

      <EditProfileModal 
        visible={isEditModalVisible} 
        onClose={() => setEditModalVisible(false)} 
        currentData={userData}
        theme={theme}
        onSave={handleUpdateProfile} // Necesitas agregar esta prop a tu modal
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