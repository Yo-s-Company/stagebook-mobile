import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
// Importamos las interfaces desde el archivo central
import { EditProfileModalProps, ManageSocialModalProps, UserProfileData } from '@/src/types';

// --- MODAL DE EDICIÓN DE PERFIL ---
export const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  visible, onClose, currentData, theme 
}) => {
  const [formData, setFormData] = useState<UserProfileData>(currentData);

  useEffect(() => {
    if (visible) setFormData(currentData);
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.bg }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Editar Perfil</Text>
          <TextInput 
            style={[styles.input, { color: theme.text, borderColor: theme.primary + '40' }]}
            value={formData.displayName}
            onChangeText={(t) => setFormData({...formData, displayName: t})}
            placeholder="Nombre Artístico"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSave, { backgroundColor: theme.primary }]} onPress={onClose}>
              <Text style={styles.btnTextWhite}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- MODAL DE REDES SOCIALES ---
export const ManageSocialModal: React.FC<ManageSocialModalProps> = ({ 
  visible, onClose, theme, contacts 
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.bg }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Mis Redes Sociales</Text>
          
          <ScrollView style={{ width: '100%' }}>
            {['instagram', 'linkedin', 'web'].map((red) => (
              <View key={red} style={{ marginBottom: 15 }}>
                <Text style={styles.label}>{red}</Text>
                <TextInput 
                  style={[styles.input, { color: theme.text, borderColor: theme.primary + '40' }]}
                  placeholder={`Link de ${red}`}
                  placeholderTextColor="#71717a"
                />
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity 
            style={[styles.btnSave, { backgroundColor: theme.primary, width: '100%' }]} 
            onPress={onClose}
          >
            <Text style={styles.btnTextWhite}>Actualizar Enlaces</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Estilos compartidos por los modales
const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.6)' },
  modalView: { width: '90%', borderRadius: 20, padding: 25, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 12, textTransform: 'uppercase', color: '#71717a', marginBottom: 5 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 5 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  btnCancel: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#f4f4f5', alignItems: 'center' },
  btnSave: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { fontWeight: 'bold' },
  btnTextWhite: { fontWeight: 'bold', color: '#fff' }
});

// Muy importante para evitar el Warning de Expo Router si lo dejas en la carpeta app
export default EditProfileModal;