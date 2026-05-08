import { ProjectDetailModal } from "@/src/components/ProjectDetailModal";
import { MyText } from "@/src/components/ThemedText";
import Typewriter from "@/src/components/Typewriter";
import { supabase } from "@/src/lib/supabase";
import { Company, CompanyNotification, EventoCalculado, ProjectSummary } from '@/src/types';
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


export default function ActiveSummaryScreen() {
  const [eventosProximos, setEventosProximos] = useState<EventoCalculado[]>([]);
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

const calcularProximosEventos = useCallback((proyectos: any[]) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const horizonteMaximo = new Date(hoy);
  horizonteMaximo.setDate(hoy.getDate() + 14);
  
  const dicDias: { [key: string]: number } = { 
    'Dom': 0, 'Lun': 1, 'Mar': 2, 'Mié': 3, 'Jue': 4, 'Vie': 5, 'Sáb': 6 
  };

  let listaEventos: any[] = [];

  proyectos.forEach(proyecto => {
    const inicio = new Date(proyecto.start_date + 'T00:00:00');
    const fin = new Date(proyecto.end_date + 'T00:00:00');
    const diasPermitidos = proyecto.dias_funcion.map((d: string) => dicDias[d]);

    for (let d = new Date(hoy); d <= fin && d <= horizonteMaximo; d.setDate(d.getDate() + 1)) {
      if (d < inicio) continue; 
      
      if (diasPermitidos.includes(d.getDay())) {
        const fechaEvento = new Date(d);
        
        // --- LÓGICA DE DÍAS RESTANTES ---
        const diffTime = fechaEvento.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const countdownText = diffDays === 0 ? "HOY" : `Faltan ${diffDays} días`;

        listaEventos.push({
          id: `${proyecto.id}-${fechaEvento.getTime()}`,
          projectTitle: proyecto.title,
          type: "Función", // Por ahora estático, listo para lógica futura
          dateDisplay: fechaEvento.toLocaleDateString('es-ES', { 
            weekday: 'long', day: 'numeric', month: 'long' 
          }),
          countdown: countdownText,
          color: proyecto.theme_color,
          rawDate: fechaEvento.getTime()
        });
      }
    }
  });

  listaEventos.sort((a, b) => a.rawDate - b.rawDate);
  setEventosProximos(listaEventos);
}, []);

  // Actualiza el useEffect que trae los proyectos para llamar a esta función
  useEffect(() => {
    if (projects.length > 0) {
      calcularProximosEventos(projects);
    }
  }, [projects, calcularProximosEventos]);

  const dynamicBg = isDark ? '#121212' : '#dedede';
  const dynamicText = isDark ? '#ded1b8' : '#18181b';
  const titles = isDark ? '#cc00ff' : '#9c0000';
  const typewriter = isDark ? '#ded1b8' : '#776837';



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
            style={[styles.headerTitle, { color: typewriter }]}
          />
        </View>


      <View style={styles.sectionDivider}>
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={toggleProyectos}
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingVertical: 5 
        }}
      >

        <MyText style={[styles.sectionTitleGreen, { marginBottom: 0, color: titles }]}>
          🟢 Proyectos en Curso ({projects.length})
        </MyText>

<Ionicons 
      name={proyectosPlegados ? "chevron-down" : "chevron-up"} 
      size={22} 
      color={titles}
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
              padding:0,
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
          <Text style={[styles.sectionTitleNormal, { color: titles }]}>
            🎬 Próximos Eventos
          </Text>

      {eventosProximos.length > 0 ? (
          eventosProximos.map((event) => (
            <View key={event.id} style={[styles.eventCard, { backgroundColor: isDark ? "#1e1e1e" : "#f4f4f5" }]}>
              {/* Barra de color lateral */}
              <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
              
              {/* Contenedor de información para evitar que se fusione con la barra */}
            <View style={styles.eventInfo}>
              <View style={styles.eventHeaderRow}>
                <Text style={[styles.eventProject, { color: isDark ? "#fff" : "#18181b" }]} numberOfLines={1}>
                  {event.projectTitle}
                </Text>

                  <View style={[styles.typeBadge, { backgroundColor: event.type === 'Función' ? '#2563eb' : '#16a34a' }]}>
                    <Text style={styles.typeBadgeText}>{event.type}</Text>
                  </View>
                </View>
                  
              <Text style={[styles.eventDateText, { color: isDark ? "#a1a1aa" : "#71717a" }]}>
                {event.dateDisplay}
              </Text>
              
              <Text style={[styles.eventCountdown, { color: event.color }]}>
                {event.countdown}
              </Text>
            </View>
          </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay funciones programadas próximamente.</Text>
        )}
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
  sectionTitleGreen: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
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
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
    overflow: 'hidden',
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
  eventColorBar: {
    width: 5,
    height: '100%',
    borderRadius: 2,
    marginRight: 12, 
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  eventProject: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 10,
    textAlign: 'center',
    marginTop: 10,
  },
eventHeaderRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
},
eventDateText: {
  fontSize: 14,
  textTransform: 'capitalize',
  marginBottom: 4,
},
eventCountdown: {
  fontSize: 13,
  fontWeight: '800',
  letterSpacing: 0.5,
},
typeBadge: {
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 6,
  marginLeft: 10,
},
typeBadgeText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: '900',
  textTransform: 'uppercase',
},
});