// CharacterModal.tsx
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CharacterModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    nuevoChar: any;
    setNuevoChar: (char: any) => void;
    theme: {
        cardBg: string;
        dynamicText: string;
        secondaryText: string;
        borderCol: string;
    };
}

export const CharacterModal = ({ visible, onClose, onSave, nuevoChar, setNuevoChar, theme }: CharacterModalProps) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                        <Text style={[styles.modalTitle, { color: theme.dynamicText }]}>DETALLES DEL PERSONAJE</Text>
                        
                        <TextInput
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol }]}
                            placeholder="Nombre del personaje*"
                            placeholderTextColor={theme.secondaryText}
                            value={nuevoChar.character_name}
                            onChangeText={(t) => setNuevoChar({...nuevoChar, character_name: t})}
                        />
                        
                        <TextInput
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol, height: 80 }]}
                            placeholder="Descripción (edad, personalidad...)"
                            placeholderTextColor={theme.secondaryText}
                            multiline
                            value={nuevoChar.description}
                            onChangeText={(t) => setNuevoChar({...nuevoChar, description: t})}
                        />

                        <TextInput
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol }]}
                            placeholder="URL Imagen de referencia"
                            placeholderTextColor={theme.secondaryText}
                            value={nuevoChar.image_ref_url}
                            onChangeText={(t) => setNuevoChar({...nuevoChar, image_ref_url: t})}
                        />
                        <TextInput
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol }]}
                            placeholder="URL Video de referencia (YouTube/TikTok)"
                            placeholderTextColor={theme.secondaryText}
                            value={nuevoChar.video_ref_url}
                            onChangeText={(t) => setNuevoChar({...nuevoChar, video_ref_url: t})}
                        />

                        <TextInput
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol }]}
                            placeholder="Actor sugerido / diseñado"
                            placeholderTextColor={theme.secondaryText}
                            value={nuevoChar.actor_dessigned}
                            onChangeText={(t) => setNuevoChar({...nuevoChar, actor_dessigned: t})}
                        />

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                            <TouchableOpacity 
                                style={[styles.modalBtn, { backgroundColor: theme.borderCol }]} 
                                onPress={onClose}
                            >
                                <Text style={{ color: theme.dynamicText }}>Cerrar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.modalBtn, { backgroundColor: '#dc2626' }]} 
                                onPress={onSave}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    modalContent: { padding: 25, borderRadius: 20, gap: 15 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalInput: { borderWidth: 1, padding: 12, borderRadius: 10 },
    modalBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' }
});