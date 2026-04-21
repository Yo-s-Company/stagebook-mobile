import { MyText } from "@/src/components/ThemedText";
import Typewriter from "@/src/components/Typewriter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  PlusIcon,
  QueueListIcon
} from "react-native-heroicons/outline";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_PROJECTS = [
  { id: "1", title: "Hamlet", charactersCount: 12, status: "Activo" },
  { id: "2", title: "La Casa de Bernarda Alba", charactersCount: 8, status: "Activo" },
];

const MOCK_EVENTS = [
  { id: "1", projectTitle: "Hamlet", type: "Ensayo", date: "Hoy · 7:00 PM" },
  { id: "2", projectTitle: "Bernarda Alba", type: "Función", date: "Mañana · 8:30 PM" },
];

export default function ActiveSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [showActions, setShowActions] = useState(false);
  const animation = useRef(new Animated.Value(0)).current; 

  const toggleMenu = () => {
    const toValue = showActions ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setShowActions(!showActions);
  };

  const actionItems = [
    { 
      label: 'NUEVO EVENTO', 
      icon: <CalendarDaysIcon color="#dc2626" />, 
      route: '/(app)/event/new' as any 
    },
    { 
      label: 'NUEVA COMPAÑÍA', 
      icon: <BuildingOfficeIcon color="#dc2626" />, 
      route: '/(app)/company/new' as any 
    },
    { 
      label: 'NUEVO PROYECTO', 
      icon: <QueueListIcon color="#dc2626" />, 
      route: '/(app)/project/new'
    },
  ];

  const actionStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
    opacity: animation,
  };

  const dynamicBg = isDark ? '#121212' : '#ded1b8';
  const dynamicText = isDark ? '#ded1b8' : '#18181b';

  return (
    <View style={{ flex: 1, backgroundColor: dynamicBg }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
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

          {MOCK_PROJECTS.map((item) => (
            <View key={item.id} style={[styles.projectCard, { backgroundColor: isDark ? '#1e1e1e' : '#FFFFFF' }]}>
              <Text style={[styles.cardTitle, { color: dynamicText }]}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>
                {item.charactersCount} Personajes · {item.status}
              </Text>
            </View>
          ))}
        </View>

        {/* EVENTOS */}
        <View style={styles.eventSection}>
          <Text style={[styles.sectionTitleNormal, { color: dynamicText }]}>
            🎬 Últimos Eventos
          </Text>

          {MOCK_EVENTS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.eventCard, { backgroundColor: isDark ? '#1a202c' : '#FFFFFF' }]}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventProjectTitle}>{item.projectTitle}</Text>
                <Text style={[styles.eventType, { color: item.type === "Ensayo" ? "#f97316" : "#16a34a" }]}>
                  {item.type}
                </Text>
              </View>
              <View style={styles.eventFooter}>
                <MaterialCommunityIcons name="clock-outline" size={14} color={isDark ? "#a1a1aa" : "#555"} />
                <Text style={[styles.eventDate, { color: isDark ? "#a1a1aa" : "#52525b" }]}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MODAL DE ACCIONES */}
      <Modal visible={showActions} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <View style={[styles.actionsContainer, { bottom: insets.bottom + 90 }]}>
              {actionItems.map((item, index) => (
                <Animated.View key={index} style={[styles.actionItem, actionStyle]}>
                  <Text style={styles.actionLabel}>{item.label}</Text>
                  <TouchableOpacity 
                    style={styles.iconCircle} 
                    onPress={() => {
                      console.log("Navegando a: ", item.route);
                      toggleMenu();
                      router.push(item.route);
                    }}
                  >
                    {item.icon}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* BOTÓN FLOTANTE PRINCIPAL */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 16 }]} 
        onPress={toggleMenu}
        activeOpacity={0.9}
      >
        <Animated.View style={{ transform: [{ rotate: animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) }] }}>
          <PlusIcon color="white" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionDivider: { marginBottom: 32, borderBottomWidth: 1, borderBottomColor: '#e4e4e7', paddingBottom: 24 },
  sectionTitleGreen: { color: '#16a34a', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  sectionTitleNormal: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  projectCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, color: '#71717a', marginTop: 4 },
  eventSection: { marginBottom: 40 },
  eventCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  eventProjectTitle: { fontWeight: 'bold', color: '#2563eb' },
  eventType: { fontSize: 12, fontWeight: 'bold' },
  eventFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventDate: { fontSize: 12 },
  // Estilos del FAB y Modal
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  actionsContainer: { position: 'absolute', right: 25, alignItems: 'flex-end', gap: 15 },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 5,
  },
});