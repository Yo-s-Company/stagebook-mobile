import { CharacterModal } from "@/src/components/CharacterModal";
import { ProductionModal } from "@/src/components/ProductionModa";
import Typewriter from "@/src/components/Typewriter";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { getStyles } from "./newStyles";
import { useProjectForm } from './useProjectForm';

export default function NuevoProyectoPage() {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const [showPicker, setShowPicker] = useState({ show: false, mode: 'start' as 'start' | 'end' });

    const { 
        formData, setFormData, 
        nuevoChar, setNuevoChar, 
        nuevoMiembro, setNuevoMiembro,
        agregarPersonajeALista, eliminarPersonaje,
        toggleDia, agregarMiembroEquipo, resetForm 
    } = useProjectForm();


    //Fecha
    const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker({ ...showPicker, show: false });

    if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        if (showPicker.mode === 'start') {
            setFormData({ ...formData, start_date: formattedDate });
        } else {
            setFormData({ ...formData, end_date: formattedDate });
        }
    }
};

    //Modals
    const[showModalProduccion, setShowModalProduccion]=useState(false);
    const [showModalPersonaje, setShowModalPersonaje] = useState(false);

    //Secciones
    const [seccionAbierta, setSeccionAbierta] = useState<number | null>(0);

    // Colores dinámicos 
    const dynamicBg = isDark ? '#121212' : '#ded1b8';
    const dynamicText = isDark ? '#ded1b8' : '#18181b';
    const cardBg = isDark ? '#1e1e1e' : '#FFFFFF';
    const secondaryText = isDark ? '#a1a1aa' : '#52525b';
    const borderCol = isDark ? '#27272a' : '#e4e4e7';

    // Genera los estilos pasando las variables
    const styles = getStyles(isDark, dynamicBg, dynamicText, borderCol, cardBg, secondaryText);

    // Función para alternar secciones
    const toggleSeccion = (index: number) => {
        setSeccionAbierta(seccionAbierta === index ? null : index);
    };

    // Componente de Cabecera para cada sección
    const RenderHeader = ({ titulo, index, icono }: { titulo: string, index: number, icono: any }) => (
        <TouchableOpacity 
            onPress={() => toggleSeccion(index)}
            style={[styles.accordionHeader, { borderBottomColor: borderCol }]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name={icono} size={20} color={dynamicText} />
                <Text style={[styles.sectionLabel, { color: dynamicText, marginBottom: 0 }]}>{titulo}</Text>
            </View>
            <Ionicons 
                name={seccionAbierta === index ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={secondaryText} 
            />
        </TouchableOpacity>
    );


const cancelarProduccion = () => {
    Alert.alert(
        "🚨 CANCELAR PRODUCCIÓN",
        "¿Estás seguro de que deseas abandonar este proyecto? Se borrarán todos los personajes, libretos y configuraciones actuales.",
        [
            { text: "SEGUIR EDITANDO", style: "cancel" },
            { 
                text: "SÍ, ABANDONAR", 
                style: "destructive", 
                onPress: () => {
                    // Resetear datos base (Tabla: projects)
                    setFormData({
                        title: '',
                        description: '',
                        script_url: null,
                        start_date: '',
                        theme_color: '#7C3AED',
                        status: 'Activo',
                        personajes: [], 
                        end_date: '',
                        dias_funcion: [],
                        equipo_produccion: [],
                    });
                    
                    // Resetear el borrador del modal de personaje
                    setNuevoChar({
                        character_name: '',
                        description: '',
                        image_ref_url: '',
                        video_ref_url: '',
                        actor_dessigned: '',
                    });
                    
                    // Volver al Acto 1 (Identidad)
                    setSeccionAbierta(0);
                }
            }
        ]
    );
};

    return (
        <View style={{ flex: 1, backgroundColor: dynamicBg }}>
            <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: 24 }]}>
                
                <View style={styles.headerContainer}>
                    <Typewriter text="NUEVO PROYECTO" speed={80} style={[styles.headerTitle, { color: dynamicText }]} />
                </View>

                {/* SECCIÓN 1: IDENTIDAD */}
                <RenderHeader titulo="1. IDENTIDAD DEL PROYECTO" index={0} icono="pencil-outline" />
                {seccionAbierta === 0 && (
                    <View style={styles.accordionContent}>
                        <TextInput
                            style={[styles.mainInput, { color: dynamicText, borderBottomColor: dynamicText }]}
                            placeholder="Nombre de la obra..."
                            placeholderTextColor={secondaryText}
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text})}
                        />
                        <TouchableOpacity style={styles.uploadBtn}>
                            <Ionicons name="cloud-upload" size={18} color="#fff" />
                            <Text style={styles.uploadBtnText}>
                                {formData.script_url ? "Guión cargado" : "Subir libreto (PDF)"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* SECCIÓN 2: VISIÓN ARTÍSTICA */}
                <RenderHeader titulo="2. VISIÓN Y CONCEPTO" index={1} icono="color-filter-outline" />
                {seccionAbierta === 1 && (
                    <View style={styles.accordionContent}>
                        <TextInput
                            style={[styles.textArea, { backgroundColor: cardBg, color: dynamicText, borderColor: borderCol }]}
                            placeholder="Describe tu propuesta escénica..."
                            multiline
                            value={formData.description}
                            onChangeText={(text) => setFormData ({ ...formData, description: text})}
                        />
                        <Text style={[styles.sectionLabel, { color: dynamicText, marginTop: 10 }]}>Color del Proyecto</Text>
                        <View style={styles.colorRow}>
                            {['#16a34a', '#7C3AED', '#DC2626', '#00e1ff'].map((color) => (
                                <TouchableOpacity 
                                    key={color} 
                                    onPress={() => setFormData({ ...formData, theme_color: color })}
                                    style={[
                                        styles.colorCircle, 
                                        { backgroundColor: color },
                                        formData.theme_color === color && { borderWidth: 2, borderColor: dynamicText }
                                    ]} 
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* SECCIÓN 3: EQUIPO Y FECHAS */}
                <RenderHeader titulo="3. PERSONAJES Y ELENCO" index={2} icono="people-outline" />
                {seccionAbierta === 2 && (
                    <View style={styles.accordionContent}>
                        {/* Renderizado de personajes agregados */}
                        {formData.personajes.map((char, index) => (
                            <View key={index} style={[styles.charCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: dynamicText, fontWeight: 'bold', fontSize: 14 }}>
                                        {char.character_name}
                                    </Text>
                                    {char.description ? (
                                        <Text style={{ color: secondaryText, fontSize: 11 }}>{char.description}</Text>
                                    ) : null}
                                </View>
                                <TouchableOpacity onPress={() => eliminarPersonaje(index)}>
                                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                                </TouchableOpacity>
                            </View>
                        ))}

                    {/* Botón para abrir el Modal */}
                    <TouchableOpacity 
                        style={styles.addMemberRow} 
                        onPress={() => setShowModalPersonaje(true)}
                    >
                        <Ionicons name="add-circle" size={32} color="#16a34a" />
                        <Text style={[styles.addMemberText, { color: dynamicText }]}>Añadir Personaje / Casting</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* SECCIÓN 4: CRONOGRAMA Y EQUIPO */}
            <RenderHeader titulo="4. CRONOGRAMA Y EQUIPO" index={3} icono="calendar-clear-outline" />
            {seccionAbierta === 3 && (
                <View style={styles.accordionContent}>
                    
                {/* Fechas con Selector de Carril */}
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    {/* Estreno */}
                    <TouchableOpacity 
                        style={{ flex: 1 }} 
                        onPress={() => setShowPicker({ show: true, mode: 'start' })}
                    >
                        <Text style={[styles.sectionLabel, { color: secondaryText }]}>Estreno</Text>
                        <View style={[styles.dateInputContainer, { backgroundColor: cardBg, borderColor: borderCol, height: 50, justifyContent: 'center', paddingHorizontal: 15 }]}>
                            <Text style={{ color: formData.start_date ? dynamicText : secondaryText }}>
                                {formData.start_date || "Seleccionar"}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Clausura */}
                    <TouchableOpacity 
                        style={{ flex: 1 }} 
                        onPress={() => setShowPicker({ show: true, mode: 'end' })}
                    >
                        <Text style={[styles.sectionLabel, { color: secondaryText }]}>Clausura</Text>
                        <View style={[styles.dateInputContainer, { backgroundColor: cardBg, borderColor: borderCol, height: 50, justifyContent: 'center', paddingHorizontal: 15 }]}>
                            <Text style={{ color: formData.end_date ? dynamicText : secondaryText }}>
                                {formData.end_date || "Seleccionar"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* El Picker (Se renderiza solo cuando show es true) */}
                {showPicker.show && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="spinner"
                        onChange={onDateChange}
                        textColor={dynamicText} // Solo para iOS
                    />
                )}
                    {/* Días de Función */}
                    <Text style={[styles.sectionLabel, { color: secondaryText, marginTop: 10 }]}>Días de función</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia) => {
                            const activo = formData.dias_funcion.includes(dia);
                            return (
                                <TouchableOpacity 
                                    key={dia}
                                    onPress={() => toggleDia(dia)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        backgroundColor: activo ? '#dc2626' : cardBg,
                                        borderWidth: 1,
                                        borderColor: activo ? '#dc2626' : borderCol
                                    }}
                                >
                                    <Text style={{ color: activo ? '#fff' : secondaryText, fontSize: 12, fontWeight: 'bold' }}>{dia}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Invitar Producción */}
                    <Text style={[styles.sectionLabel, { color: secondaryText, marginTop: 15 }]}>Equipo de Producción</Text>
                    {formData.equipo_produccion.map((m, i) => (
                        <View key={i} style={[styles.charCard, { backgroundColor: cardBg, borderColor: borderCol, paddingVertical: 8 }]}>
                            <Text style={{ color: dynamicText, fontWeight: 'bold' }}>@{m.username} <Text style={{ fontWeight: 'normal', color: secondaryText }}>- {m.role}</Text></Text>
                        </View>
                    ))}
                    
                    <TouchableOpacity 
                        style={[styles.addMemberRow, { marginTop: 5 }]} 
                        onPress={() => setShowModalProduccion(true)}
                    >
                        <Ionicons name="person-add-outline" size={24} color="#16a34a" />
                        <Text style={[styles.addMemberText, { color: dynamicText }]}>Invitar producción</Text>
                    </TouchableOpacity>
                </View>
            )}

                {/* ACCIONES DE PRODUCCIÓN */}
                <View style={styles.buttonContainer}>
                    {/* Botón Principal */}
                    <TouchableOpacity 
                        style={[styles.primaryBtn, { backgroundColor: '#dc2626' }]} 
                        activeOpacity={0.8}
                        onPress={() => console.log("Lanzando a Supabase...", formData)}
                    >
                        <Text style={styles.primaryBtnText}>LANZAR PROYECTO</Text>
                    </TouchableOpacity>

                    {/* Botón de Reinicio / Cancelar */}
                    <TouchableOpacity 
                        style={[styles.secondaryBtn, { 
                            backgroundColor: 'transparent', 
                            borderWidth: 1, 
                            borderColor: borderCol,
                            flexDirection: 'row', 
                            gap: 10 
                        }]} 
                        activeOpacity={0.7}
                        onPress={cancelarProduccion}
                    >
                        <Ionicons name="trash-bin-outline" size={18} color="#dc2626" />
                        <Text style={[styles.secondaryBtnText, { color: '#dc2626', fontWeight: 'bold' }]}>
                            CANCELAR PRODUCCIÓN
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

    {/*Modals*/}
        <CharacterModal 
            visible={showModalPersonaje}
            onClose={() => setShowModalPersonaje(false)}
            onSave={agregarPersonajeALista}
            nuevoChar={nuevoChar}
            setNuevoChar={setNuevoChar}
            theme={{ cardBg, dynamicText, secondaryText, borderCol }}
        />

        <ProductionModal 
            visible={showModalProduccion}
            onClose={() => setShowModalProduccion(false)}
            onSave={agregarMiembroEquipo}
            nuevoMiembro={nuevoMiembro}
            setNuevoMiembro={setNuevoMiembro}
            theme={{ cardBg, dynamicText, secondaryText, borderCol }}
        />
        </View>
    );
}