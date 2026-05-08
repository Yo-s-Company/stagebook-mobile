import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  CalendarDaysIcon,
  InformationCircleIcon
} from "react-native-heroicons/outline";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProjectDetailModalProps {
  visible: boolean;
  onClose: () => void;
  project: any;
  isDark: boolean;
}

export const ProjectDetailModal = ({ visible, onClose, project, isDark }: ProjectDetailModalProps) => {
  if (!project) return null;

  const themeColor = project.theme_color || '#7C3AED';
  const textColor = isDark ? '#ded1b8' : '#18181b';
  const bgColor = isDark ? '#1e1e1e' : '#FFFFFF';

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalFullOverlay}>
        <View style={[styles.detailContent, { backgroundColor: bgColor }]}>
          
          {/* Cabecera Estilo Consulting */}
          <View style={[styles.detailHeader, { borderBottomColor: themeColor }]}>
             <Text style={[styles.detailTitle, { color: textColor }]} numberOfLines={1}>
               {project.title}
             </Text>
          </View>

          <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
            
            {/* ÉNFASIS EN EL PERSONAJE / ROL */}
            <View style={[styles.highlightSection, { backgroundColor: themeColor + '15' }]}>
              <Text style={[styles.label, { color: themeColor }]}>MI ROL EN LA PRODUCCIÓN</Text>
              <View style={styles.roleMainRow}>
                <View style={[styles.iconBox, { backgroundColor: themeColor }]}>
                    <MaterialCommunityIcons 
                    name={project.isActor ? "theater" : "account-settings"} 
                    size={28} 
                    color="white" 
                    />
                </View>
                <View>
                    <Text style={[styles.roleName, { color: textColor }]}>{project.myRole || 'Colaborador'}</Text>
                    <Text style={styles.roleType}>
                        {project.isActor ? "Elenco / Actor" : "Staff de Producción"}
                    </Text>
                </View>
              </View>
            </View>

            {/* GRID DE INFORMACIÓN */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <CalendarDaysIcon size={22} color={themeColor} />
                <View>
                  <Text style={styles.infoLabel}>Periodo</Text>
                  <Text style={[styles.infoValue, { color: textColor }]}>
                    {project.start_date || 'N/A'} — {project.end_date || 'N/A'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <InformationCircleIcon size={22} color={themeColor} />
                <View>
                  <Text style={styles.infoLabel}>Estado</Text>
                  <Text style={[styles.infoValue, { color: textColor }]}>{project.status}</Text>
                </View>
              </View>
            </View>

            {/* DESCRIPCIÓN / VISIÓN */}
            <View style={styles.descriptionBox}>
              <Text style={[styles.label, { color: themeColor }]}>NOTAS DEL PROYECTO</Text>
              <Text style={[styles.descriptionText, { color: textColor }]}>
                {project.description || "Sin descripción disponible para este proyecto activo."}
              </Text>
            </View>

          </ScrollView>

          <TouchableOpacity 
            style={[styles.primaryActionBtn, { backgroundColor: themeColor }]}
            onPress={onClose}
          >
            <Text style={styles.primaryActionText}>Cerrar Detalles</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalFullOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  detailContent: { 
    height: SCREEN_HEIGHT * 0.8, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 3, marginBottom: 20 },
  closeBtn: { marginRight: 12 },
  detailTitle: { fontSize: 30, fontWeight: 'bold', flex: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailScroll: { paddingBottom: 30 },
  highlightSection: { padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  label: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginBottom: 12, textTransform: 'uppercase' },
  roleMainRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  roleName: { fontSize: 24, fontWeight: 'bold' },
  roleType: { fontSize: 13, color: '#71717a', fontWeight: '500' },
  infoGrid: { gap: 20, marginBottom: 24 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  infoLabel: { fontSize: 12, color: '#71717a', marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600' },
  descriptionBox: { paddingVertical: 15 },
  descriptionText: { fontSize: 15, lineHeight: 24, opacity: 0.85 },
  primaryActionBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 'auto' },
  primaryActionText: { color: '#fff', fontWeight: '800', fontSize: 16, textTransform: 'uppercase' },
});