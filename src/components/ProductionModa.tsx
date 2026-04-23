// ProductionModal.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ProductionModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    nuevoMiembro: { username: string; role: string };
    setNuevoMiembro: (miembro: any) => void;
    theme: {
        cardBg: string;
        dynamicText: string;
        secondaryText: string;
        borderCol: string;
    };
}

export const ProductionModal = ({ visible, onClose, onSave, nuevoMiembro, setNuevoMiembro, theme }: ProductionModalProps) => {
    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                    <Text style={[styles.modalTitle, { color: theme.dynamicText }]}>INVITAR COLABORADOR</Text>
                    
                    <TextInput
                        style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol }]}
                        placeholder="Nombre de usuario (@usuario)"
                        placeholderTextColor={theme.secondaryText}
                        value={nuevoMiembro.username}
                        onChangeText={(t) => setNuevoMiembro({...nuevoMiembro, username: t.toLowerCase()})}
                        autoCapitalize="none"
                    />
                    
                    <TextInput
                        style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol }]}
                        placeholder="Rol (Ej: Iluminador, Productor)"
                        placeholderTextColor={theme.secondaryText}
                        value={nuevoMiembro.role}
                        onChangeText={(t) => setNuevoMiembro({...nuevoMiembro, role: t})}
                    />

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                        <TouchableOpacity 
                            style={[styles.modalBtn, { backgroundColor: theme.borderCol }]} 
                            onPress={onClose}
                        >
                            <Text style={{ color: theme.dynamicText }}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.modalBtn, { backgroundColor: '#16a34a' }]} 
                            onPress={onSave}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Invitar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        justifyContent: 'center', 
        padding: 20 
    },
    modalContent: { 
        padding: 25, 
        borderRadius: 20, 
        gap: 15 
    },
    modalTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    modalInput: { 
        borderWidth: 1, 
        padding: 12, 
        borderRadius: 10 
    },
    modalBtn: { 
        flex: 1, 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center' 
    }
});