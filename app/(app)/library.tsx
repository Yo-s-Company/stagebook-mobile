import { ProjectDetailModal } from '@/src/components/ProjectDetailModal';
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
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export default function LibraryScreen() {
    const [scripts, setScripts] = useState<any[]>([]);
    const [filteredScripts, setFilteredScripts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const isDark = useColorScheme() === 'dark';

    // Estados para el Modal
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleProjectPress = (project: any) => {
        setSelectedProject(project);
        setIsModalVisible(true);
    };

    const fetchScripts = async () => {
        setLoading(true);
        try {
            // Traemos todos los campos y la relación con personajes para el conteo
            const { data, error } = await supabase
                .from('projects')
                .select('*, project_characters(id)')
                .not('script_url', 'is', null);

            if (error) throw error;

            if (data) {
                // Transformamos los datos para que el Modal reciba lo que espera
                const transformed = data.map(p => ({
                    ...p,
                    charactersCount: p.project_characters?.length || 0,
                    myRole: 'Lectura de Libreto', // Rol por defecto en biblioteca
                    isActor: false
                }));
                setScripts(transformed);
                setFilteredScripts(transformed);
            }
        } catch (error) {
            console.error("Error fetching scripts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScripts();
    }, []);

    useEffect(() => {
        const filtered = scripts.filter(item =>
            item.script_url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredScripts(filtered);
    }, [searchQuery, scripts]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => handleProjectPress(item)}
            style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
        >
            <View style={[
                styles.iconContainer, 
                { backgroundColor: (item.theme_color || '#7C3AED') + '20' }
            ]}>
                <Ionicons name="document-text" size={24} color={item.theme_color || '#7C3AED'} />
            </View>

            <View style={styles.cardInfo}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                    {item.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {item.script_url}
                </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={isDark ? "#555" : "#ccc"} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Biblioteca</Text>
                <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#eee' }]}>
                    <Ionicons name="search" size={20} color="#888" />
                    <TextInput
                        style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
                        placeholder="Buscar libreto o proyecto..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#9e0000" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={filteredScripts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchScripts} tintColor="#9e0000" />
                    }
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: isDark ? '#555' : '#aaa' }]}>
                            No se encontraron textos.
                        </Text>
                    }
                />
            )}

            {/* Modal de Detalle */}
            <ProjectDetailModal 
                visible={isModalVisible}
                project={selectedProject}
                onClose={() => setIsModalVisible(false)}
                isDark={isDark}
            />
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
        borderRadius: 10, 
        gap: 10 
    },
    searchInput: { flex: 1, fontSize: 16 },
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 12, 
        borderRadius: 15, 
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    iconContainer: { 
        marginRight: 15, 
        padding: 10, 
        borderRadius: 12 
    },
    cardInfo: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { fontSize: 13, color: '#666' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
});