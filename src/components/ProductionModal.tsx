// ProductionModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ROLES_PREDEFINIDOS = [
    'Asistente de Producción', 
    'Técnico', 
    'Vestuarista', 
    'Escenógrafo',
    'Director de Arte',
    'Stage Manager',
    'Coreógrafo',
    'Diseñador Sonoro'
];

interface ProductionModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    nuevoMiembro: { username: string; role: string };
    setNuevoMiembro: (miembro: any) => void;
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

export const ProductionModal = ({ 
    visible, onClose, onSave, nuevoMiembro, setNuevoMiembro, theme,
    busquedaActores, buscando, onBuscarActor, setBusquedaActores 
}: ProductionModalProps) => {
    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                    <Text style={[styles.modalTitle, { color: theme.dynamicText }]}>INVITAR COLABORADOR</Text>
                    
                    {/* Búsqueda de Usuario */}
                    <View style={{ zIndex: 2000 }}>
                        <TextInput
                            style={[styles.modalInput, { color: theme.dynamicText, borderColor: theme.borderCol }]}
                            placeholder="Buscar usuario (@usuario)"
                            placeholderTextColor={theme.secondaryText}
                            value={nuevoMiembro.username}
                            onChangeText={(t) => {
                                setNuevoMiembro({...nuevoMiembro, username: t.toLowerCase()});
                                onBuscarActor(t);
                            }}
                            autoCapitalize="none"
                        />

                        {busquedaActores.length > 0 && (
                            <View style={[styles.resultadosBusqueda, { backgroundColor: theme.cardBg, borderColor: theme.borderCol }]}>
                                {busquedaActores.map((actor) => (
                                    <TouchableOpacity
                                        key={actor.id}
                                        style={styles.actorItem}
                                        onPress={() => {
                                            setNuevoMiembro({ 
                                                ...nuevoMiembro, 
                                                username: actor.full_name, 
                                                assigned_profile_id: actor.id 
                                            });
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
                                        <Text style={{ color: theme.dynamicText, fontWeight: 'bold' }}>@{actor.username}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Selección de Rol (Etiquetas) */}
                    <Text style={{ color: theme.secondaryText, fontSize: 12, marginTop: 10 }}>Selecciona un Rol:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {ROLES_PREDEFINIDOS.map((rol) => {
                            const seleccionado = nuevoMiembro.role === rol;
                            return (
                                <TouchableOpacity
                                    key={rol}
                                    style={[
                                        styles.roleChip, 
                                        { borderColor: seleccionado ? '#16a34a' : theme.borderCol,
                                          backgroundColor: seleccionado ? '#16a34a20' : 'transparent' }
                                    ]}
                                    onPress={() => setNuevoMiembro({ ...nuevoMiembro, role: rol })}
                                >
                                    <Text style={{ 
                                        color: seleccionado ? '#16a34a' : theme.dynamicText,
                                        fontSize: 12,
                                        fontWeight: seleccionado ? 'bold' : 'normal'
                                    }}>
                                        {rol}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                        <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.borderCol }]} onPress={onClose}>
                            <Text style={{ color: theme.dynamicText }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalBtn, { backgroundColor: '#16a34a' }]} 
                            onPress={() => {onSave();onClose();}}
                            disabled={!nuevoMiembro.username || !nuevoMiembro.role}
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
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    modalContent: { padding: 25, borderRadius: 20, gap: 15 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalInput: { borderWidth: 1, padding: 12, borderRadius: 10 },
    modalBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
    resultadosBusqueda: {
        position: 'absolute',
        top: 55,
        left: 0,
        right: 0,
        borderRadius: 10,
        borderWidth: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        zIndex: 999,
    },
    actorItem: { flexDirection: 'row', padding: 10, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
    avatarContainer: { marginRight: 12 },
    avatarImage: { width: 30, height: 30, borderRadius: 15 },
    avatarPlaceholder: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    roleChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },

});