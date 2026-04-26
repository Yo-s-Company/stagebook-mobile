import { supabase } from '@/src/lib/supabase';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
    const [invitations, setInvitations] = useState<any[]>([]);

    const fetchInvitations = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data } = await supabase
            .from('project_invitations')
            .select('*, projects(title, description, theme_color)')
            .eq('receiver_id', user?.id)
            .eq('status', 'pending');
        setInvitations(data || []);
    };

    const handleAction = async (invitation: any, action: 'accepted' | 'rejected') => {
        if (action === 'accepted') {
            // 1. Insertar en la tabla real (ej. project_characters)
            if (invitation.role === 'Actor') {
                await supabase.from('project_characters').insert([{
                    project_id: invitation.project_id,
                    character_name: invitation.character_data.character_name,
                    assigned_profile_id: invitation.receiver_id
                }]);
            }
        }
        
        // 2. Actualizar estado de la invitación
        await supabase.from('project_invitations')
            .update({ status: action })
            .eq('id', invitation.id);
            
        fetchInvitations();
        Alert.alert("Éxito", `Has ${action === 'accepted' ? 'aceptado' : 'rechazado'} la invitación.`);
    };

    useEffect(() => { fetchInvitations(); }, []);

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#121212' }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Invitaciones</Text>
            <FlatList 
                data={invitations}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ color: '#fff' }}>
                            Te invitaron a <Text style={{ fontWeight: 'bold' }}>{item.projects.title}</Text> como {item.role}.
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                            <TouchableOpacity onPress={() => handleAction(item, 'accepted')} style={{ backgroundColor: '#16a34a', padding: 8, borderRadius: 5 }}>
                                <Text style={{ color: '#fff' }}>Aceptar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleAction(item, 'rejected')} style={{ backgroundColor: '#dc2626', padding: 8, borderRadius: 5 }}>
                                <Text style={{ color: '#fff' }}>Rechazar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}