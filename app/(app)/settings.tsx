import { MyText } from '@/src/components/ThemedText';
import Typewriter from '@/src/components/Typewriter';
import { supabase } from '@/src/lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Appearance,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const systemScheme = useColorScheme();
  const isDark = systemScheme === 'dark';

  // Estados para Notificaciones
  const [notifEnsayo, setNotifEnsayo] = useState(true);
  const [notifFuncion, setNotifFuncion] = useState(true);
  const [notifEvento, setNotifEvento] = useState(false);

  const dynamicBg = isDark ? '#121212' : '#dedede';
  const dynamicText = isDark ? '#ded1b8' : '#000000'; 
  const cardBg = isDark ? '#1e1e1e' : '#bebebe'; 
  const titles = isDark ? '#cc00ff' : '#9c0000';
  const typewriter = isDark ? '#ded1b8' : '#776837';

  const handleLogout = async () => {
    Alert.alert('Finalizar Función', '¿Estás seguro de que quieres abandonar el camerino?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (!error) router.replace('/(auth)/login');
      }},
    ]);
  };

  // Componente reutilizable para las filas de las tarjetas
  const SettingRow = ({ label, icon, onPress, children }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.rowItem}>
      <View style={styles.rowLeft}>
        {icon && <MaterialCommunityIcons name={icon} size={20} color="#52525b" style={{ marginRight: 12 }} />}
        <MyText style={[styles.rowText, { color: dynamicText }]}>{label}</MyText>
      </View>
      {children}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: dynamicBg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Typewriter 
            text="CONFIGURACION DE LA CUENTA" 
            speed={80} 
            style={[styles.headerTitle, { color: typewriter }]} 
          />
        </View>
        {/* AJUSTES DE PERFIL */}
        <View style={styles.section}>
          <MyText style={[styles.sectionLabel, {color: titles}]}>Ajustes de Perfil</MyText>
          <View style={[styles.cardContainer, { backgroundColor: cardBg }]}>
            <SettingRow label="Cambiar Nombre" onPress={() => {}} />
            <SettingRow label="Editar Bio" onPress={() => {}} />
            <SettingRow label="Cambiar foto de perfil" onPress={() => {}}>
               <Image source={{ uri: 'https://via.placeholder.com/30' }} style={styles.miniAvatar} />
            </SettingRow>
          </View>
        </View>

        {/* SEGURIDAD Y ACCESO */}
        <View style={styles.section}>
          <MyText style={[styles.sectionLabel, {color: titles}]}>Seguridad y Acceso</MyText>
          <View style={[styles.cardContainer, { backgroundColor: cardBg }]}>
            <SettingRow label="Cambiar Contraseña" onPress={() => {}} />
            <SettingRow label="Verificación de Dos Pasos" onPress={() => {}} />
          </View>
        </View>

        {/* NOTIFICACIONES */}
        <View style={styles.section}>
          <MyText style={[styles.sectionLabel, {color: titles}]}>Notificaciones</MyText>
          <View style={[styles.cardContainer, { backgroundColor: cardBg }]}>
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <MyText style={[styles.rowText, {color: dynamicText}]}>Notificaciones de </MyText>
                <View style={[styles.tag, { backgroundColor: '#f97316' }]}><MyText style={styles.tagText}>Ensayo</MyText></View>
              </View>
              <Switch value={notifEnsayo} onValueChange={setNotifEnsayo} trackColor={{ true: '#7C3AED' }} />
            </View>
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <MyText style={[styles.rowText, {color: dynamicText}]}>Alertas de </MyText>
                <View style={[styles.tag, { backgroundColor: '#0000ff' }]}><MyText style={styles.tagText}>Función</MyText></View>
              </View>
              <Switch value={notifFuncion} onValueChange={setNotifFuncion} trackColor={{ true: '#7C3AED' }} />
            </View>
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <MyText style={[styles.rowText, {color: dynamicText}]}>Alerta de </MyText>
                <View style={[styles.tag, { backgroundColor: '#008000' }]}><MyText style={styles.tagText}>Evento</MyText></View>
              </View>
              <Switch value={notifEvento} onValueChange={setNotifEvento} trackColor={{ true: '#7C3AED' }} />
            </View>
          </View>
        </View>

        {/* TEMA */}
        <View style={styles.section}>
          <MyText style={[styles.sectionLabel, {color: titles}]}>Tema</MyText>
          <View style={[styles.cardContainer, { backgroundColor: cardBg }]}>
            <SettingRow label="Claro" onPress={() => Appearance.setColorScheme('light')} />
            <SettingRow label="Oscuro" onPress={() => Appearance.setColorScheme('dark')} />
            <SettingRow label="Igual al del sistema" onPress={() => Appearance.setColorScheme(null)} />
          </View>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <TouchableOpacity style={styles.saveBtn}>
          <MyText style={styles.saveBtnText}>GUARDAR CAMBIOS</MyText>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtnFull}>
          <MyText style={styles.logoutBtnTextFull}>CERRAR SESIÓN</MyText>
        </TouchableOpacity>

        <MyText style={styles.footerVersion}>StageBook v1.0.0 — 2026</MyText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 30, textTransform: 'uppercase' },
  section: { marginBottom: 25 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#3f3f46', marginBottom: 10, textTransform: 'uppercase' },
  cardContainer: { borderRadius: 12, overflow: 'hidden' },
  rowItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 15 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 15, color: '#18181b' },
  miniAvatar: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: '#000' },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 5 },
  tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#000', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  logoutBtnFull: { backgroundColor: '#e11d48', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  logoutBtnTextFull: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  footerVersion: { textAlign: 'center', color: '#71717a', fontSize: 10, marginTop: 30 },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      letterSpacing: -1,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
      headerContainer: { alignItems: 'center', marginBottom: 40, justifyContent: 'center' },

});