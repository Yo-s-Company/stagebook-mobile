import Typewriter from '@/src/components/Typewriter';
import { supabase } from '@/src/lib/supabase';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

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

const generarMarcasCalendario = (proyectos: any[]) => {
        let marks: any = {};
        const dicDias: { [key: string]: number } = { 'Dom': 0, 'Lun': 1, 'Mar': 2, 'Mié': 3, 'Jue': 4, 'Vie': 5, 'Sáb': 6 };

        proyectos.forEach(proyecto => {
            const inicio = new Date(proyecto.start_date + 'T00:00:00');
            const fin = new Date(proyecto.end_date + 'T00:00:00');
            const diasPermitidos = proyecto.dias_funcion.map((d: string) => dicDias[d]);

            // Recorremos cada día desde el estreno hasta la clausura
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                const dateString = d.toISOString().split('T')[0];
                const esDiaDeFuncion = diasPermitidos.includes(d.getDay());

                if (esDiaDeFuncion) {
                    marks[dateString] = {
                        marked: true,
                        dotColor: proyecto.theme_color,
                        selected: true,
                        selectedColor: proyecto.theme_color + '30', // Fondo suave para el rango
                    };
                }
            }
        });
        setMarkedDates(marks);
    };

const handleDayPress = (day: any) => {
        const found = projects.filter(p => {
            const inicio = new Date(p.start_date);
            const fin = new Date(p.end_date);
            const actual = new Date(day.dateString);
            return actual >= inicio && actual <= fin;
        });
        setSelectedDayProjects(found);
    };

    const typewriter = isDark ? '#ded1b8' : '#776837';
    const dynamicBg = isDark ? '#121212' : '#dedede';
    const titles = isDark ? '#cc00ff' : '#9c0000';

return (
        <View style={[styles.container, { backgroundColor: dynamicBg }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerWrapper}>
                    <Typewriter text="AGENDA" speed={80} style={[styles.headerTitle, { color: typewriter }]} />
                </View>
                                
                <Calendar
                    theme={{
                        calendarBackground: isDark ? '#1e1e1e' : '#fff',
                        textSectionTitleColor: '#9e0000',
                        todayTextColor: '#9e0000',
                        dayTextColor: isDark ? '#fff' : '#2d4150',
                        monthTextColor: isDark ? '#fff' : '#2d4150',
                    }}
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    style={styles.calendar}
                />

                <View style={styles.detailsContainer}>
                    <Text style={[styles.sectionLabel, { color: isDark ? '#cc00ff' : '#9e0000' }]}>
                        Eventos de la Temporada:
                    </Text>
                    {loading ? (
                        <ActivityIndicator color="#9e0000" />
                    ) : selectedDayProjects.length > 0 ? (
                        selectedDayProjects.map(p => (
                            <View key={p.id} style={[styles.eventCard, { borderLeftColor: p.theme_color, backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                                <Text style={[styles.eventTitle, { color: isDark ? '#fff' : '#000' }]}>{p.title}</Text>
                                <Text style={styles.eventSubtitle}>Producción en Temporada</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>Selecciona una fecha marcada para ver los detalles.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: 60, paddingBottom: 40 },
    headerWrapper: { alignItems: 'center', marginBottom: 15 },
    headerTitle: { fontSize: 28, fontWeight: 'bold' },
    calendar: { borderRadius: 15, marginHorizontal: 20, elevation: 5, shadowOpacity: 0.1 },
    detailsContainer: { padding: 25 },
    sectionLabel: { fontWeight: 'bold', marginBottom: 15, fontSize: 13, textTransform: 'uppercase' },
    eventCard: { padding: 15, borderLeftWidth: 5, borderRadius: 8, marginBottom: 10, elevation: 2 },
    eventTitle: { fontSize: 18, fontWeight: 'bold' },
    eventSubtitle: { color: '#666', fontSize: 13, marginTop: 4 },
    emptyText: { color: '#888', fontStyle: 'italic', marginTop: 10, textAlign: 'center' },
});