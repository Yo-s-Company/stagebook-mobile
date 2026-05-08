import { CharacterModal } from "@/src/components/CharacterModal";
import { LoadingOverlay } from "@/src/components/LoadingOverlay";
import { ProductionModal } from "@/src/components/ProductionModal";
import Typewriter from "@/src/components/Typewriter";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyles } from "./(app)/project/newStyles";
import { useProjectForm } from './(app)/project/useProjectForm';

export default function NuevoProyectoPage() {
    const { editingId } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const [showPicker, setShowPicker] = useState({ show: false, mode: 'start' as 'start' | 'end' });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { 
        formData, setFormData, 
        nuevoChar, setNuevoChar, 
        nuevoMiembro, setNuevoMiembro,
        agregarPersonajeALista, eliminarPersonaje,
        toggleDia, agregarMiembroEquipo, resetForm, pickDocument,
        setBusquedaActores,busquedaActores, buscando, buscarActorEnBaseDeDatos,
        guardarProyectoEnBaseDeDatos, cargarDatosParaEditar
    } = useProjectForm(editingId as string);

    
        useEffect(() => {
        if (editingId) {
            cargarDatosParaEditar(editingId as string);
        }
    }, [editingId]);



    //Fecha
const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker({ ...showPicker, show: false });

    if (selectedDate) {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        if (showPicker.mode === 'start') {
            // 🛑 VALIDACIÓN: Estreno no puede ser posterior a clausura
            if (formData.end_date && formattedDate > formData.end_date) {
                Alert.alert(
                    "Error de Cronología",
                    "El estreno no puede ser después de la clausura. Se ha reiniciado la selección."
                );
                // Reiniciamos solo la fecha de inicio
                setFormData({ ...formData, start_date: '' });
                return;
            }
            setFormData({ ...formData, start_date: formattedDate });
        } else {
            // 🛑 VALIDACIÓN: Clausura no puede ser anterior al estreno
            if (formattedDate < formData.start_date) {
                Alert.alert(
                    "Error de Cronología",
                    "La clausura no puede ser antes del estreno. Se ha reiniciado la selección."
                );
                // Reiniciamos solo la fecha de fin
                setFormData({ ...formData, end_date: '' });
                return;
            }

            // 🚀 LÓGICA DE ESTADO (Solo si la cronología es válida)
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            const fechaSeleccionada = new Date(selectedDate);
            fechaSeleccionada.setHours(0, 0, 0, 0);

            if (fechaSeleccionada < hoy) {
                Alert.alert(
                    "🎬 Nota de Producción", 
                    "Como la fecha de clausura ya pasó, el proyecto se marcará como Inactivo."
                );
                setFormData({ 
                    ...formData, 
                    end_date: formattedDate, 
                    status: 'Inactivo'
                });
            } else {
                setFormData({ 
                    ...formData, 
                    end_date: formattedDate, 
                    status: 'Activo'
                });
            }
        }
    }
};

    //Modals
    const[showModalProduccion, setShowModalProduccion]=useState(false);
    const [showModalPersonaje, setShowModalPersonaje] = useState(false);

    //Secciones
    const [seccionAbierta, setSeccionAbierta] = useState<number | null>(0);

    // Colores dinámicos 
    const cardBg = isDark ? '#1e1e1e' : '#FFFFFF';
    const secondaryText = isDark ? '#a1a1aa' : '#52525b';
    const borderCol = isDark ? '#27272a' : '#e4e4e7';
    const dynamicBg = isDark ? '#121212' : '#dedede';
    const dynamicText = isDark ? '#ded1b8' : '#18181b';
    const typewriter = isDark ? '#ded1b8' : '#776837';

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
                        id: null,
                        title: '',
                        description: '',
                        script_url: '',
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
                        assigned_profile_id: ''
                    });
                    
                    // Volver al Acto 1 (Identidad)
                    setSeccionAbierta(0);
                }
            }
        ]
    );
};

const handleGuardar = async () => {
        // VALIDACIONES
        if (!formData.title.trim()) return Alert.alert("Faltan datos", "El nombre es obligatorio.");
        if (!formData.start_date || !formData.end_date) {
            return Alert.alert("Fechas incompletas", "Define estreno y clausura.");
        }

        setIsSaving(true);
        // ✅ 3. LLAMADA SIN ARGUMENTOS: El hook ya tiene el estado interno
        const resultado = await guardarProyectoEnBaseDeDatos();
        setIsSaving(false);

        if (resultado.success) {
            Alert.alert(
                formData.id ? "¡Producción Actualizada!" : "¡Arriba el telón!",
                formData.id ? "Los cambios se guardaron correctamente." : "¡Proyecto creado exitosamente!",
                [{ text: "OK", onPress: () => {
                    resetForm();
                    router.replace('/(app)');
                }}]
            );
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: dynamicBg, paddingTop: insets.top }}>
            <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: 24 }]}>
                
                <View style={styles.headerContainer}>
                    <Typewriter text="SE LEVANTA EL TELÓN" speed={80} style={[styles.headerTitle, { color: typewriter }]} />
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
                        <TouchableOpacity 
                            style={[styles.uploadBtn, formData.script_url && { backgroundColor: '#16a34a' }]} 
                            onPress={pickDocument}
                        >
                            <Ionicons 
                                name={formData.script_url ? "checkmark-circle" : "cloud-upload"} 
                                size={18} 
                                color="#fff" 
                            />
                            <Text style={styles.uploadBtnText}>
                                {/* Cambiamos el mensaje para incluir Word */}
                                {formData.script_url ? formData.script_url : "Subir libreto (PDF, Word)"}
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
                            <Text style={{ color: dynamicText, fontWeight: 'bold' }}>@{char.actor_dessigned} <Text style={{ fontWeight: 'normal', color: secondaryText }}>- {char.character_name}</Text></Text>

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
                
                    <Text style={{ color: '#9e0000', fontSize: 12, marginTop: 5 }}>
                        Estado del proyecto: {formData.status}
                    </Text>
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
                        style={[styles.primaryBtn, { backgroundColor: formData.theme_color }]} 
                        onPress={async () => {
                            // 1. VALIDACIONES PREVIAS (Sin encender el cargando aún)
                            if (!formData.title.trim()) {
                                return Alert.alert("Faltan datos", "El nombre es obligatorio.");
                            }

                            if (!formData.start_date || !formData.end_date) {
                                return Alert.alert(
                                    "Fechas incompletas", 
                                    "Para levantar el telón, debes definir tanto la fecha de estreno como la de clausura. Podrás editarlo después"
                                );
                            }

                            if (formData.dias_funcion.length === 0) {
                                return Alert.alert(
                                    "Faltan funciones", 
                                    "Debes seleccionar al menos un día de función a la semana. Podrás editarlo después"
                                );
                            }

                            // 2. INICIO DE PROCESO (Ahora sí encendemos el Overlay)
                            setIsSaving(true); 

                            const hoy = new Date();
                            hoy.setHours(0, 0, 0, 0);
                            
                            const fechaClausura = new Date(formData.end_date + 'T00:00:00'); 
                            const estadoReal = fechaClausura < hoy ? 'Inactivo' : 'Activo';

                            const proyectoAEnviar = {
                                ...formData,
                                status: estadoReal
                            };

                            // 3. LLAMADA A BASE DE DATOS
                            const resultado = await guardarProyectoEnBaseDeDatos();
                            
                            // 4. APAGAR OVERLAY INDEPENDIENTEMENTE DEL RESULTADO
                            setIsSaving(false); 
                            
                            if (resultado.success) {
                                setIsSuccess(true); 

                                const mensajeAlert = estadoReal == 'Inactivo' 
                                    ? "El proyecto se creó como INACTIVO debido a la fecha de clausura." 
                                    : "¡Proyecto creado exitosamente!";
                                    
                                Alert.alert(
                                    "¡Arriba el telón!", 
                                    mensajeAlert,
                                    [
                                        { 
                                            text: "OK", 
                                            onPress: () => {
                                                resetForm();
                                                router.replace('/(app)'); 
                                            } 
                                        }
                                    ]
                                );
                            }
                        }}
                    >
                <TouchableOpacity onPress={guardarProyectoEnBaseDeDatos}>
                <Text>
                    {formData.id ? "GUARDAR CAMBIOS" : "LANZAR PROYECTO"}
                </Text>
                </TouchableOpacity>
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
                            REINICIAR PRODUCCIÓN
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
            busquedaActores={busquedaActores}
            buscando={buscando}
            onBuscarActor={buscarActorEnBaseDeDatos}
            setBusquedaActores={setBusquedaActores}
            theme={{ cardBg, dynamicText, secondaryText, borderCol }}
        />

        <ProductionModal 
            visible={showModalProduccion}
            onClose={() => setShowModalProduccion(false)}
            onSave={agregarMiembroEquipo}
            nuevoMiembro={nuevoMiembro}
            setNuevoMiembro={setNuevoMiembro}
            busquedaActores={busquedaActores}
            buscando={buscando}
            onBuscarActor={buscarActorEnBaseDeDatos}
            setBusquedaActores={setBusquedaActores}
            theme={{ cardBg, dynamicText, secondaryText, borderCol }}
        />
        <LoadingOverlay visible={isSaving} message="MONTANDO EL ESCENARIO..." />
        </View>
    );
}