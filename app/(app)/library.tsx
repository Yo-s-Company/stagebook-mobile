import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export default function LibraryScreen() {
    const [scripts, setScripts] = useState<any[]>([]);
    const [filteredScripts, setFilteredScripts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const isDark = useColorScheme() === 'dark';

    const fetchScripts = async () => {
        setLoading(true);
        // 🚀 Traemos el script_url y el título del proyecto relacionado
        const { data, error } = await supabase
            .from('projects')
            .select('id, title, script_url, theme_color')
            .not('script_url', 'is', null); // Solo proyectos que tengan un texto

        if (!error) {
            setScripts(data || []);
            setFilteredScripts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        const filtered = scripts.filter(item => 
            item.script_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredScripts(filtered);
    }, [searchQuery, scripts]);

    useEffect(() => {
        fetchScripts();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="document-text" size={30} color={item.theme_color} />
            </View>
            <View style={styles.cardInfo}>
                <Text numberOfLines={1} style={[styles.fileName, { color: isDark ? '#fff' : '#000' }]}>
                    {item.script_url}
                </Text>
                <Text style={styles.projectName}>
                    Proyecto: <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                </Text>
            </View>
            <Ionicons name="download-outline" size={20} color="#9e0000" />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>BIBLIOTECA</Text>
                
                <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#e4e4e7' }]}>
                    <Ionicons name="search" size={18} color={isDark ? "#ded1b8" : "#71717a"} />
                    <TextInput
                        style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
                        placeholder="Buscar libreto o proyecto..."
                        placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"}
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
                        <Text style={styles.emptyText}>No se encontraron textos.</Text>
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
    searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45, borderRadius: 10, gap: 10 },
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
    iconContainer: { marginRight: 15 },
    cardInfo: { flex: 1 },
    fileName: { fontSize: 16, fontWeight: '600' },
    projectName: { color: '#71717a', fontSize: 13, marginTop: 2 },
    emptyText: { textAlign: 'center', marginTop: 100, color: '#71717a' }
});