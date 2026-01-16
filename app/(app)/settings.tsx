import { MyText } from '@/src/components/ThemedText';
import { supabase } from '@/src/lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Appearance,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const systemScheme = useColorScheme();
  const isDark = systemScheme === 'dark';

  const themes = [
    { id: 'light', label: 'Claro', icon: 'white-balance-sunny' },
    { id: 'dark', label: 'Oscuro', icon: 'moon-waning-crescent' },
    { id: 'system', label: 'Sistema', icon: 'responsive' },
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Finalizar Función',
      '¿Estás seguro de que quieres abandonar el camerino?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const dynamicBg = isDark ? '#121212' : '#FFFFFF';
  const dynamicCard = isDark ? '#1c1c1e' : '#f4f4f5';
  const dynamicText = isDark ? '#FFFFFF' : '#000000';
  const dynamicBorder = isDark ? '#2c2c2e' : '#e4e4e7';

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: dynamicBg }]}>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
        <MyText style={[styles.mainTitle, { color: dynamicText }]}>
          Ajustes de <MyText style={styles.textRed}>Escena</MyText>
        </MyText>

        {/* SECCIÓN: APARIENCIA */}
        <View style={styles.section}>
          <MyText style={styles.sectionLabel}>Apariencia</MyText>
          <View style={[styles.cardContainer, { backgroundColor: dynamicCard, borderColor: dynamicBorder }]}>
            {themes.map((theme, index) => {
              const isActive = systemScheme === theme.id || theme.id === 'system';
              return (
                <TouchableOpacity
                  key={theme.id}
                  onPress={() => {
                    if (theme.id === 'system') Appearance.setColorScheme(null);
                    else Appearance.setColorScheme(theme.id as any);
                  }}
                  style={[
                    styles.rowItem,
                    index !== themes.length - 1 && { borderBottomWidth: 1, borderBottomColor: dynamicBorder },
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <MaterialCommunityIcons
                      name={theme.icon as any}
                      size={20}
                      color={isActive ? '#7C3AED' : '#71717a'}
                    />
                    <MyText style={[styles.rowText, { color: dynamicText }, isActive && styles.fontBold]}>
                      {theme.label}
                    </MyText>
                  </View>
                  {isActive && <MaterialCommunityIcons name="check" size={20} color="#7C3AED" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECCIÓN: CUENTA */}
        <View style={styles.section}>
          <MyText style={styles.sectionLabel}>Cuenta</MyText>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/onboarding')}
            style={[styles.accountBtn, { backgroundColor: dynamicCard, borderColor: dynamicBorder }]}
          >
            <MaterialCommunityIcons name="account-edit-outline" size={22} color="#71717a" />
            <MyText style={[styles.accountBtnText, { color: dynamicText }]}>Editar Perfil Artístico</MyText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.logoutBtn, { backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2' }]}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#ef4444" />
            <MyText style={styles.logoutBtnText}>Cerrar Sesión</MyText>
          </TouchableOpacity>
        </View>

        <MyText style={styles.footerVersion}>StageBook v1.0.0 — 2026</MyText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 40,
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  textRed: { color: '#dc2626' },
  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: '#71717a', marginBottom: 16, marginLeft: 4 },
  cardContainer: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  rowItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 16, opacity: 0.9, marginLeft: 12 },
  fontBold: { fontWeight: 'bold', opacity: 1 },
  accountBtn: { padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, marginBottom: 12 },
  accountBtnText: { fontSize: 16, fontWeight: 'bold', marginLeft: 12 },
  logoutBtn: { padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  logoutBtnText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', marginLeft: 12 },
  footerVersion: { textAlign: 'center', color: '#71717a', fontSize: 10, marginTop: 48, marginBottom: 40, letterSpacing: 1.5, textTransform: 'uppercase' },
});
