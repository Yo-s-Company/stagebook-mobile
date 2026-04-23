// CharacterModal.tsx
// CharacterModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CharacterModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    nuevoChar: any;
    setNuevoChar: (char: any) => void;
    busquedaActores: any[]; 
    buscando: boolean;
    onBuscarActor: (texto: string) => void;
    setBusquedaActores: (data: any[]) => void;
    theme: {
        cardBg: string;
        dynamicText: string;
        secondaryText: string;
        borderCol: string;
    };
}

export const CharacterModal = ({ 
    visible, onClose, onSave, nuevoChar, setNuevoChar, theme, 
    busquedaActores, buscando, onBuscarActor, setBusquedaActores 
}: CharacterModalProps) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                {/* Usamos keyboardShouldPersistTaps para que al tocar un actor no se cierre el teclado inmediatamente */}
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled" 
                >
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
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol, height: 60 }]}
                            placeholder="Descripción (edad, personalidad...)"
                            placeholderTextColor={theme.secondaryText}
                            multiline
                            value={nuevoChar.description}
                            onChangeText={(t) => setNuevoChar({...nuevoChar, description: t})}
                        />

                        

                        {/* Inputs de abajo deben tener zIndex menor para que la lista pase por encima */}
                        <TextInput
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol, zIndex: 1 }]}
                            placeholder="URL Imagen de referencia"
                            placeholderTextColor={theme.secondaryText}
                            value={nuevoChar.image_ref_url}
                            onChangeText={(t) => setNuevoChar({...nuevoChar, image_ref_url: t})}
                        />
                        <TextInput
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol, zIndex: 1 }]}
                            placeholder="URL Video de referencia"
                            placeholderTextColor={theme.secondaryText}
                            value={nuevoChar.video_ref_url}
                            onChangeText={(t) => setNuevoChar({...nuevoChar, video_ref_url: t})}
                        />
                        {/* Contenedor con Z-Index para la búsqueda flotante */}
                        <View style={{ zIndex: 2000, elevation: 5 }}> 
                            <TextInput
                                style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol }]}
                                placeholder="Buscar actor sugerido..."
                                placeholderTextColor={theme.secondaryText}
                                value={nuevoChar.actor_dessigned}
                                onChangeText={(t) => {
                                    setNuevoChar({...nuevoChar, actor_dessigned: t});
                                    onBuscarActor(t);
                                }}
                            />

                            {busquedaActores.length > 0 && (
                                <View style={[styles.resultadosBusqueda, { backgroundColor: theme.cardBg, borderColor: theme.borderCol }]}>
                                    {busquedaActores.map((actor: any) => (
                                        <TouchableOpacity 
                                            key={actor.id}
                                            style={styles.actorItem}
                                            onPress={() => {
                                                setNuevoChar({...nuevoChar, actor_dessigned: actor.username, assigned_profile_id: actor.id});
                                                setBusquedaActores([]); 
                                            }}
                                        >
                                            <View style={styles.avatarContainer}>
                                                {actor.avatar_url ? (
                                                    <Image source={{ uri: actor.avatar_url }} style={styles.avatarImage} />
                                                ) : (
                                                    <View style={[styles.avatarPlaceholder, { backgroundColor: theme.borderCol }]}>
                                                        <Ionicons name="person" size={14} color={theme.secondaryText} />
                                                    </View>
                                                )}
                                            </View>

                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: theme.dynamicText, fontWeight: 'bold' }}>@{actor.username}</Text>
                                                {actor.full_name && (
                                                    <Text style={{ color: theme.secondaryText, fontSize: 11 }}>{actor.full_name}</Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.borderCol }]} onPress={onClose}>
                                <Text style={{ color: theme.dynamicText }}>Cerrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#dc2626' }]} onPress={() => {onSave();onClose();}}>
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
    modalBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
    resultadosBusqueda: {
    position: 'absolute',
    top: 55, // Justo debajo del input
    left: 0,
    right: 0,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    zIndex: 999,
},
avatarContainer: {
    marginRight: 12,
},
avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18, 
    backgroundColor: '#ccc',
},
avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
},
actorItem: {
    flexDirection: 'row', 
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
},
});