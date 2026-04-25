import { supabase } from '@/src/lib/supabase';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars'; // 🚀 La librería Pro

// Configuración en español
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function AgendaCalendarScreen() {
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDayProjects, setSelectedDayProjects] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const isDark = useColorScheme() === 'dark';

    useEffect(() => {
        fetchProjectsAndMarkCalendar();
    }, []);

    const fetchProjectsAndMarkCalendar = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'Activo');

        if (!error && data) {
            setProjects(data);
            generarMarcasCalendario(data);
        }
        setLoading(false);
    };

    // 🧠 LÓGICA DE INGENIERÍA: Mapear proyectos a fechas del calendario
    const generarMarcasCalendario = (proyectos: any[]) => {
        let marks: any = {};

        proyectos.forEach(proyecto => {
            // Aquí podrías expandir la lógica para marcar cada día entre start y end
            // Por ahora marcamos el día de inicio como ejemplo de "Estreno"
            marks[proyecto.start_date] = {
                marked: true,
                dotColor: proyecto.theme_color,
                selected: true,
                selectedColor: proyecto.theme_color + '30', // Color suave de fondo
            };
        });
        setMarkedDates(marks);
    };

    const handleDayPress = (day: any) => {
        // Filtrar proyectos que coincidan con el día seleccionado
        const found = projects.filter(p => p.start_date === day.dateString);
        setSelectedDayProjects(found);
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>CARTELERA</Text>
            
            <Calendar
                theme={{
                    backgroundColor: 'transparent',
                    calendarBackground: isDark ? '#1e1e1e' : '#fff',
                    textSectionTitleColor: '#9e0000',
                    selectedDayBackgroundColor: '#9e0000',
                    todayTextColor: '#9e0000',
                    dayTextColor: isDark ? '#fff' : '#2d4150',
                    monthTextColor: isDark ? '#fff' : '#2d4150',
                    indicatorColor: '#9e0000',
                }}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                style={styles.calendar}
            />

            <ScrollView style={styles.detailsContainer}>
                <Text style={styles.sectionLabel}>Eventos del día:</Text>
                {selectedDayProjects.length > 0 ? (
                    selectedDayProjects.map(p => (
                        <View key={p.id} style={[styles.eventCard, { borderLeftColor: p.theme_color }]}>
                            <Text style={[styles.eventTitle, { color: isDark ? '#fff' : '#000' }]}>{p.title}</Text>
                            <Text style={styles.eventSubtitle}>Estreno de producción</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No hay funciones programadas para esta fecha.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, letterSpacing: 2 },
    calendar: { borderRadius: 15, marginHorizontal: 20, elevation: 5, shadowOpacity: 0.1 },
    detailsContainer: { padding: 25 },
    sectionLabel: { color: '#666', fontWeight: 'bold', marginBottom: 10, fontSize: 12 },
    eventCard: { padding: 15, backgroundColor: '#9e000010', borderLeftWidth: 5, borderRadius: 8, marginBottom: 10 },
    eventTitle: { fontSize: 18, fontWeight: 'bold' },
    eventSubtitle: { color: '#666', fontSize: 13 },
    emptyText: { color: '#888', fontStyle: 'italic', marginTop: 10 }
});