import { ProjectDetailModal } from "@/src/components/ProjectDetailModal";
import { MyText } from "@/src/components/ThemedText";
import Typewriter from "@/src/components/Typewriter";
import { supabase } from "@/src/lib/supabase";
import { Company, CompanyNotification, ProjectSummary } from '@/src/types';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from "react-native";
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  PlusIcon,
  QueueListIcon
} from "react-native-heroicons/outline";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const MOCK_EVENTS = [
  { id: "1", projectTitle: "Hamlet", type: "Ensayo", date: "Hoy · 7:00 PM" },
  { id: "2", projectTitle: "Bernarda Alba", type: "Función", date: "Mañana · 8:30 PM" },
];

export default function ActiveSummaryScreen() {
  const navigation = useNavigation<any>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  //Modal
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [proyectosPlegados, setProyectosPlegados] = useState(true);

  const [loading, setLoading] = useState (true);
  const [refreshing, setRefreshing] = useState (false);
  //Compañias Veremos si lo ponemos en esta pantalla
  const [companies, setCompanies] = useState<Company[]>([]);
  const [notifications, setNotifications] = useState<CompanyNotification[]>([]);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  const [showActions, setShowActions] = useState(false);
  const animation = useRef(new Animated.Value(0)).current; 

  const handleProjectPress = (project: any) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };
  const toggleProyectos = () => {
    setProyectosPlegados(!proyectosPlegados);
  };
const fetchData = async () => {
  try {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Ejecutar consultas en paralelo para mejorar la velocidad
    const [invsResult, charsResult] = await Promise.all([
      // Buscar invitaciones de staff aceptadas
      supabase
        .from('project_invitations')
        .select('project_id, role')
        .eq('receiver_id', user.id)
        .eq('status', 'accepted'),
      // Buscar personajes asignados (actores)
      supabase
        .from('project_characters')
        .select('project_id, character_name')
        .eq('assigned_profile_id', user.id)
    ]);

    // 2. Extraer IDs para filtrar los proyectos
    const idsInvitaciones = invsResult.data?.map(i => i.project_id) || [];
    const idsPersonajes = charsResult.data?.map(d => d.project_id) || [];
    const todosMisIds = [...new Set([...idsInvitaciones, ...idsPersonajes])];

    // 3. Consultar los proyectos donde soy dueño o participante
    let query = supabase
      .from('projects')
      .select('*, project_characters(id)')
      .eq('status', 'Activo');

    if (todosMisIds.length > 0) {
      query = query.or(`founder_id.eq.${user.id},id.in.(${todosMisIds.join(',')})`);
    } else {
      query = query.eq('founder_id', user.id);
    }

    const { data: projectsData, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    if (projectsData) {
      // 4. Transformar los datos para incluir el Rol y estado de Actor
      const transformed = projectsData.map(p => {
        const character = charsResult.data?.find(c => c.project_id === p.id);
        const invitation = invsResult.data?.find(i => i.project_id === p.id);
        
        // Determinamos el rol: Actor > Staff > Director
        let userRole = 'Director / Fundador';
        if (character) userRole = character.character_name;
        else if (invitation) userRole = invitation.role;

        return {
          ...p,
          charactersCount: p.project_characters?.length || 0,
          myRole: userRole,
          isActor: !!character, // Si tiene un personaje, es actor
          theme_color: p.theme_color || '#7C3AED'
        };
      });

      setProjects(transformed);
    }
  } catch (e) {
    console.error("Error en fetchData:", e);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

// función para reffresh con pull
const onRefresh = useCallback(() => {
  setRefreshing(true);
  fetchData();
}, []);

useEffect(() => {
    fetchData();
  }, []);

  const toggleMenu = () => {
    const toValue = showActions ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setShowActions(!showActions);
  };

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#dc2626" />
        }
      >
        
        <View style={styles.headerContainer}>
          <Typewriter 
            text="RESUMEN DE ACTIVIDAD" 
            speed={80} 
            style={[styles.headerTitle, { color: dynamicText }]} 
          />
        </View>


      <View style={styles.sectionDivider}>
  <TouchableOpacity 
    activeOpacity={0.7} 
    onPress={toggleProyectos}
    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
  >

        <MyText style={styles.sectionTitleGreen}>
          🟢 Proyectos en Curso ({projects.length})
        </MyText>

<Ionicons 
      name={proyectosPlegados ? "chevron-down" : "chevron-up"} 
      size={22} 
      color="#16a34a" 
    />
  </TouchableOpacity>

  {/* Contenido Colapsable */}
  {!proyectosPlegados && (
    <View>
      {projects.map((item) => (
        <TouchableOpacity 
          key={item.id} 
          activeOpacity={0.8}
          onPress={() => handleProjectPress(item)} 
          style={[
            styles.projectCard, 
            { 
              backgroundColor: isDark ? '#1e1e1e' : '#FFFFFF', 
              borderLeftColor: item.theme_color || '#7C3AED',
              borderLeftWidth: 6,
              marginBottom: 12
            }
          ]}
        >
          <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: isDark ? '#ded1b8' : '#18181b', fontSize: 18 }]}>
                {item.title}
              </Text>
              <View style={[styles.roleBadgeSmall, { backgroundColor: (item.theme_color || '#7C3AED') + '20' }]}>
                <Text style={[styles.roleBadgeTextSmall, { color: item.theme_color || '#7C3AED' }]}>
                  {item.myRole}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={20} 
              color={isDark ? "#52525b" : "#a1a1aa"} 
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>
      <ProjectDetailModal 
        visible={isModalVisible}
        project={selectedProject}
        onClose={() => setIsModalVisible(false)}
        isDark={isDark}
      />

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

{/* MODAL DE ACCIONES CON BOTONES EXPLÍCITOS */}
<Modal visible={showActions} transparent animationType="fade">
  <TouchableWithoutFeedback onPress={toggleMenu}>
    <View style={styles.modalOverlay}>
      <View style={[styles.actionsContainer, { bottom: insets.bottom + 90 }]}>
        
        {/* OPCIÓN: NUEVO PROYECTO */}
        <Animated.View style={[styles.actionItem, actionStyle]}>
          <Text style={styles.actionLabel}>NUEVO PROYECTO</Text>
          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]} 
            onPress={() => {
              toggleMenu();
              // Usamos la ruta directa sin el grupo (app)
              router.push('/new-project');
            }}
          >
            <QueueListIcon color="#dc2626" size={20} />
          </TouchableOpacity>
        </Animated.View>

        {/* OPCIÓN: NUEVA COMPAÑÍA */}
        <Animated.View style={[styles.actionItem, actionStyle]}>
          <Text style={styles.actionLabel}>NUEVA COMPAÑÍA</Text>
          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]} 
            onPress={() => {
              toggleMenu();
              router.push('/company/new' as any);
            }}
          >
            <BuildingOfficeIcon color="#dc2626" size={20} />
          </TouchableOpacity>
        </Animated.View>

        {/* OPCIÓN: NUEVO EVENTO */}
        <Animated.View style={[styles.actionItem, actionStyle]}>
          <Text style={styles.actionLabel}>NUEVO EVENTO</Text>
          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]} 
            onPress={() => {
              toggleMenu();
              router.push('/event/new' as any);
            }}
          >
            <CalendarDaysIcon color="#dc2626" size={20} />
          </TouchableOpacity>
        </Animated.View>

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
  roleBadgeSmall: {
    alignSelf: 'flex-start', 
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 8,
  },

  roleBadgeTextSmall: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
  },
});