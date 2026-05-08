import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from 'react-native';

export default function ArchiveScreen() {
    const [inactiveProjects, setInactiveProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [loading, setLoading] = useState(true);
    const isDark = useColorScheme() === 'dark';

    const fetchInactiveProjects = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Buscar IDs en invitaciones y asignaciones directas
        const { data: invs } = await supabase.from('project_invitations').select('project_id').eq('receiver_id', user.id).eq('status', 'accepted');
        const { data: dir } = await supabase.from('project_characters').select('project_id').eq('assigned_profile_id', user.id);
        
        const idsRelacionados = [...(invs?.map(i => i.project_id) || []), ...(dir?.map(d => d.project_id) || [])];

        // 2. Consulta con filtro de estado Inactivo
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'Inactivo')
            .or(`founder_id.eq.${user.id},id.in.(${idsRelacionados.join(',') || '00000000-0000-0000-0000-000000000000'})`)
            .order('end_date', { ascending: false });

        if (!error) {
            setInactiveProjects(data || []);
            setFilteredProjects(data || []);
        }
        setLoading(false);
    };

    // 🔍 Lógica de filtrado en tiempo real
    useEffect(() => {
        const filtered = inactiveProjects.filter(project => 
            project.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [searchQuery, inactiveProjects]);

    useEffect(() => {
        fetchInactiveProjects();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <View style={[styles.colorBar, { backgroundColor: item.theme_color }]} />
            <View style={styles.cardInfo}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{item.title}</Text>
                <Text style={styles.date}>Finalizó: {item.end_date}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#ded1b8" : "#666"} />
        </View>
    );

    const dynamicBg = isDark ? '#121212' : '#dedede';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: '#776837' }]}>BAÚL DE RECUERDOS</Text>
                
                {/* 🔍 BARRA DE BÚSQUEDA */}
                <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#e4e4e7' }]}>
                    <Ionicons name="search" size={18} color={isDark ? "#ded1b8" : "#71717a"} style={{ marginRight: 10 }} />
                    <TextInput
                        style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
                        placeholder="Buscar por título..."
                        placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <Ionicons 
                            name="close-circle" 
                            size={18} 
                            color={isDark ? "#ded1b8" : "#71717a"} 
                            onPress={() => setSearchQuery('')} 
                        />
                    )}
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#9e0000" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={filteredProjects}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchInactiveProjects} tintColor="#9e0000" />
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {searchQuery.length > 0 ? "No hay resultados para tu búsqueda." : "El archivo está vacío."}
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, paddingTop: 60 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15 },
    searchContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 15, 
        height: 45, 
        borderRadius: 10 
    },
    searchInput: { flex: 1, fontSize: 16 },
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 12, 
        borderRadius: 12, 
        overflow: 'hidden',
        paddingRight: 15,
        elevation: 3,
    },
    colorBar: { width: 6, height: '100%' },
    cardInfo: { flex: 1, padding: 15 },
    title: { fontSize: 17, fontWeight: 'bold' },
    date: { color: '#71717a', fontSize: 12, marginTop: 4 },
    emptyText: { textAlign: 'center', marginTop: 100, color: '#71717a' }
});