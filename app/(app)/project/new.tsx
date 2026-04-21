import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NuevoProyectoPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [titulo, setTitulo] = useState('');
  const [vision, setVision] = useState('');
  const scheme = useColorScheme();
  const isDark = scheme == 'dark';  

  const dynamicBg = isDark ? '#121212' : '#F4F4F5';
  const dynamicText = isDark ? '#FFFFFF' : '#18181b';

  return (
    <View style={[styles.mainContainer, { backgroundColor: dynamicBg }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.headerTitle, {color: dynamicText}]}>CREACIÓN DE NUEVO PROYECTO</Text>

        {/* INPUT TÍTULO */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.mainInput}
            placeholder="Titulo del Proyecto"
            placeholderTextColor="#52525b"
            value={titulo}
            onChangeText={setTitulo}
          />
          <Text style={styles.inputSub}>Ej: Hamlet</Text>
        </View>

        {/* BOTÓN SUBIR GUION */}
        <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7}>
          <Ionicons name="cloud-upload" size={20} color="#fff" />
          <Text style={styles.uploadBtnText}>Subir guión</Text>
        </TouchableOpacity>

        {/* SECCIÓN SINOPSIS */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sinopsis / Descripción</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Escribe tu visión..."
            placeholderTextColor="#a1a1aa"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={vision}
            onChangeText={setVision}
          />
        </View>

        {/* AÑADIR ELENCO */}
        <TouchableOpacity style={styles.addMemberRow} activeOpacity={0.6}>
          <Ionicons name="add-circle" size={32} color="#00FF00" />
          <Text style={styles.addMemberText}>Añadir elenco / Equipo (0/100)</Text>
        </TouchableOpacity>

        {/* FECHAS */}
        <View style={styles.row}>
          <View style={styles.dateCol}>
            <Text style={styles.sectionLabel}>Fecha de Estreno</Text>
            <View style={styles.dateInputContainer}>
              <Text style={styles.datePlaceholder}>Fecha de inicio</Text>
              <Ionicons name="calendar-outline" size={18} color="#a1a1aa" />
            </View>
          </View>
          <View style={styles.dateCol}>
            <Text style={styles.sectionLabel}>Fecha de Cierre</Text>
            <View style={styles.dateInputContainer}>
              <Text style={styles.datePlaceholder}>Fecha de fin</Text>
              <Ionicons name="calendar-outline" size={18} color="#a1a1aa" />
            </View>
          </View>
        </View>

        {/* COLOR DEL PROYECTO */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Color del Proyecto</Text>
          <Text style={styles.inputSub}>Asignar un nuevo ID visual</Text>
          <View style={styles.colorRow}>
            {['#00FF00', '#008000', '#7C3AED', '#DC2626'].map((color, i) => (
              <View key={i} style={[styles.colorCircle, { backgroundColor: color }]} />
            ))}
            <View style={[styles.colorCircle, { backgroundColor: '#f4f4f5' }]} />
          </View>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>CREAR PROYECTO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>GUARDAR COMO BORRADOR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  scrollContainer: { paddingHorizontal: 25, paddingBottom: 40 },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputSection: { marginBottom: 25 },
  mainInput: {
    fontSize: 26,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingVertical: 5,
    color: '#000',
  },
  inputSub: { fontSize: 11, color: '#a1a1aa', marginTop: 5 },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#00BFFF',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
  },
  uploadBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  section: { marginBottom: 25 },
  sectionLabel: { fontSize: 13, fontWeight: 'bold', color: '#18181b', marginBottom: 8 },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    minHeight: 120,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  addMemberText: { fontSize: 14, fontWeight: 'bold', color: '#18181b' },
  row: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  dateCol: { flex: 1 },
  dateInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f5',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePlaceholder: { color: '#a1a1aa', fontSize: 12 },
  colorRow: { flexDirection: 'row', gap: 10, marginTop: 10, backgroundColor: '#f4f4f5', padding: 8, borderRadius: 12, alignSelf: 'flex-start' },
  colorCircle: { width: 18, height: 18, borderRadius: 4 },
  buttonContainer: { marginTop: 20, gap: 12 },
  primaryBtn: {
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  secondaryBtn: {
    backgroundColor: '#a1a1aa',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
});