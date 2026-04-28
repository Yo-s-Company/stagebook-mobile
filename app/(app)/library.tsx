import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { WebView } from 'react-native-webview'; // Asegúrate de instalar esta librería

export default function LibraryScreen() {
    const [scripts, setScripts] = useState<any[]>([]);
    const [filteredScripts, setFilteredScripts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const isDark = useColorScheme() === 'dark';

    // Estados para el visor interno
    const [viewerUrl, setViewerUrl] = useState<string | null>(null);
    const [currentProjectTitle, setCurrentProjectTitle] = useState('');

    const fetchScripts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('id, title, script_url, theme_color')
                .eq('status', 'Activo')
                .not('script_url', 'is', null);

            if (error) throw error;
            setScripts(data || []);
            setFilteredScripts(data || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchScripts(); }, []);

    useEffect(() => {
        const filtered = scripts.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredScripts(filtered);
    }, [searchQuery, scripts]);

    // Abre el visor sin salir de la app
const abrirVisorInterno = async (scriptPath: string, title: string) => {
    try {
        setLoading(true);
        setCurrentProjectTitle(title);

        // 1. Creamos una URL firmada con disposición "inline" para evitar la descarga automática
        const { data, error } = await supabase.storage
            .from('project_scripts')
            .createSignedUrl(scriptPath, 3600); // URL válida por 1 hora

        if (error) throw error;

        let finalUrl = data.signedUrl;

        const lowerPath = scriptPath.toLowerCase();
        if (lowerPath.endsWith('.pdf') || lowerPath.endsWith('.docx') || lowerPath.endsWith('.doc')) {
            finalUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(data.signedUrl)}`;
        }

        // 2. Truco para Android: Google Docs Viewer es necesario para renderizar PDFs en WebView
        if (Platform.OS === 'android' && scriptPath.toLowerCase().endsWith('.pdf')) {
            finalUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(data.signedUrl)}`;
        }

        setViewerUrl(finalUrl);
    } catch (error) {
        console.error("Error al generar vista previa:", error);
        Alert.alert("Error", "No se pudo cargar la vista previa del libreto.");
    } finally {
        setLoading(false);
    }
};
    const descargarLibreto = async (scriptPath: string) => {
        const { data } = supabase.storage.from('project_scripts').getPublicUrl(scriptPath);
        await WebBrowser.openBrowserAsync(data.publicUrl);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            onPress={() => abrirVisorInterno(item.script_url, item.title)}
            style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
        >
            <View style={[styles.iconContainer, { backgroundColor: (item.theme_color || '#dc2626') + '20' }]}>
                <Ionicons name="document-text" size={24} color={item.theme_color || '#dc2626'} />
            </View>
            
            <View style={styles.cardInfo}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{item.title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{item.script_url}</Text>
            </View>

            <TouchableOpacity 
                onPress={() => descargarLibreto(item.script_url)}
                style={styles.downloadBtn}
            >
                <Ionicons name="download-outline" size={22} color="#dc2626" />
            </TouchableOpacity>
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
                        placeholder="Buscar por título..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredScripts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchScripts} tintColor="#dc2626" />}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay libretos activos.</Text>}
            />

            {/* 🎭 MODAL DEL LECTOR INTERNO */}
            <Modal visible={!!viewerUrl} animationType="slide" presentationStyle="fullScreen">
                <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>
                    <View style={[styles.viewerHeader, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
                        <TouchableOpacity onPress={() => setViewerUrl(null)} style={styles.closeBtn}>
                            <Ionicons name="close" size={28} color={isDark ? "#fff" : "#000"} />
                        </TouchableOpacity>
                        
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={[styles.viewerTitle, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>
                                {currentProjectTitle}
                            </Text>
                            <Text style={styles.viewerSubtitle}>Modo Lectura</Text>
                        </View>

                        {/* Espacio para futuros botones como "Ensayo Guiado" */}
                        <TouchableOpacity style={styles.toolBtn}>
                             <Ionicons name="mic-outline" size={24} color="#dc2626" />
                        </TouchableOpacity>
                    </View>
                    
                    {viewerUrl && (
                        <WebView 
                            source={{ uri: viewerUrl }} 
                            style={{ flex: 1 }}
                            startInLoadingState={true}
                            originWhitelist={['*']}
                            allowsInlineMediaPlayback={true}
                            javaScriptEnabled={true}
                            userAgent='="Mozilla/5.0'
                            renderLoading={() => (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="large" color="#dc2626" />
                                    <Text style={{ color: isDark ? '#888' : '#666', marginTop: 10 }}>Preparando libreto...</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, paddingTop: 60 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45, borderRadius: 12 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    card: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderRadius: 16, padding: 16, elevation: 2 },
    iconContainer: { padding: 10, borderRadius: 12, marginRight: 15 },
    cardInfo: { flex: 1 },
    title: { fontSize: 17, fontWeight: 'bold' },
    subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
    downloadBtn: { padding: 8 },
    // Estilos del Lector
    viewerHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: 50, 
        paddingBottom: 15, 
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    closeBtn: { width: 40 },
    toolBtn: { width: 40, alignItems: 'flex-end' },
    viewerTitle: { fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' },
    viewerSubtitle: { fontSize: 10, color: '#dc2626', fontWeight: 'bold' },
    loaderContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#888' }
});