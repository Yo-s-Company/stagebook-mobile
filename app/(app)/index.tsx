import { MyText } from "@/src/components/ThemedText";
import Typewriter from "@/src/components/Typewriter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

const MOCK_PROJECTS = [
  { id: "1", title: "Hamlet", charactersCount: 12, status: "Activo" },
  { id: "2", title: "La Casa de Bernarda Alba", charactersCount: 8, status: "Activo" },
];

const MOCK_EVENTS = [
  {
    id: "1",
    projectTitle: "Hamlet",
    type: "Ensayo",
    date: "Hoy · 7:00 PM",
  },
  {
    id: "2",
    projectTitle: "Bernarda Alba",
    type: "Función",
    date: "Mañana · 8:30 PM",
  },
];

export default function ActiveSummaryScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Colores dinámicos para el fondo
  const dynamicBg = isDark ? '#121212' : '#E5E4E2';
  const dynamicText = isDark ? '#FFFFFF' : '#000000';

  return (
    <ScrollView style={[styles.container, { backgroundColor: dynamicBg }]}>
      
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Typewriter 
          text="RESUMEN DE ACTIVIDAD" 
          speed={80} 
          style={[styles.headerTitle, { color: dynamicText }]} 
        />
      </View>

      {/* PROYECTOS ACTIVOS */}
      <View style={styles.sectionDivider}>
        <MyText style={styles.sectionTitleGreen}>
          🟢 Proyectos en Curso ({MOCK_PROJECTS.length})
        </MyText>

        <FlatList
          data={MOCK_PROJECTS}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={[styles.projectCard, { backgroundColor: isDark ? '#1e1e1e' : '#f4f4f5' }]}>
              <Text style={[styles.cardTitle, { color: dynamicText }]}>
                {item.title}
              </Text>
              <Text style={styles.cardSubtitle}>
                {item.charactersCount} Personajes · {item.status}
              </Text>
            </View>
          )}
        />
      </View>

      {/* EVENTOS */}
      <View style={styles.eventSection}>
        <Text style={[styles.sectionTitleNormal, { color: dynamicText }]}>
          🎬 Últimos Eventos
        </Text>

        <FlatList
          data={MOCK_EVENTS}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.eventCard, { backgroundColor: isDark ? '#1a202c' : '#eff6ff' }]}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventProjectTitle}>
                  {item.projectTitle}
                </Text>
                <Text
                  style={[
                    styles.eventType,
                    { color: item.type === "Ensayo" ? "#f97316" : "#16a34a" }
                  ]}
                >
                  {item.type}
                </Text>
              </View>

              <View style={styles.eventFooter}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={isDark ? "#a1a1aa" : "#555"}
                />
                <Text style={[styles.eventDate, { color: isDark ? "#a1a1aa" : "#52525b" }]}>
                  {item.date}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionDivider: {
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 24,
  },
  sectionTitleGreen: {
    color: '#16a34a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitleNormal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  projectCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    // Sombras
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },
  eventSection: {
    marginBottom: 40,
  },
  eventCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventProjectTitle: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  eventType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDate: {
    fontSize: 12,
  }
});