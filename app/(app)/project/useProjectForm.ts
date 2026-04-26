import { supabase } from '@/src/lib/supabase';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UserProfile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
}
interface Personaje {
    character_name: string;
    description?: string;
    image_ref_url?: string;
    video_ref_url?: string;
    assigned_profile_id?: string | null;
    actor_dessigned?: string; 
}

interface MiembroEquipo {
    username: string;
    role: string;
    assigned_profile_id?: string | null;
}

export const useProjectForm = () => {

const guardarProyectoEnBaseDeDatos = async (datosFinales?: any) => { 
    
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            Alert.alert("Error de sesión", "Debes estar logueado.");
            return { success: false };
        }

        const dataParaGuardar = datosFinales || formData;

        // 1. Insertar el Proyecto Base
        const { data: proyectoCreado, error: errorProyecto } = await supabase
            .from('projects')
            .insert([{
                title: dataParaGuardar.title,
                description: dataParaGuardar.description,
                script_url: dataParaGuardar.script_url,
                start_date: dataParaGuardar.start_date,
                end_date: dataParaGuardar.end_date,
                dias_funcion: dataParaGuardar.dias_funcion,
                theme_color: dataParaGuardar.theme_color,
                status: dataParaGuardar.status,
                founder_id: user.id
            }])
            .select()
            .single();

        if (errorProyecto) throw errorProyecto;
        const projectId = proyectoCreado.id;

        // --- MANEJO DE PERSONAJES Y ELENCO ---
            if (dataParaGuardar.personajes.length > 0) {
                // Especificamos que 'p' es de tipo 'Personaje'
                const invitados = dataParaGuardar.personajes.filter((p: Personaje) => p.assigned_profile_id && p.assigned_profile_id !== user.id);
                const soloTexto = dataParaGuardar.personajes.filter((p: Personaje) => !p.assigned_profile_id || p.assigned_profile_id === user.id);

                if (soloTexto.length > 0) {
                    
                    const personajesData = soloTexto.map((p: Personaje) => ({
                        project_id: projectId,
                        character_name: p.character_name,
                        description: p.description,
                        image_ref_url: p.image_ref_url,
                        video_ref_url: p.video_ref_url,
                        assigned_profile_id: p.assigned_profile_id
                    }));
                    await supabase.from('project_characters').insert(personajesData);
                }
                // invitaciones para actores
            if (invitados.length > 0) {
                
                const invitacionesData = invitados.map((p:Personaje) => ({
                    project_id: projectId,
                    sender_id: user.id,
                    receiver_id: p.assigned_profile_id,
                    role: 'Actor',
                    character_data: {
                        character_name: p.character_name,
                        description: p.description || '',
                        image_ref_url: p.image_ref_url || '',
                        video_ref_url: p.video_ref_url || ''
                    },
                    status: 'pending'
                }));
                await supabase.from('project_invitations').insert(invitacionesData);
            }
        }

        // --- 🛠️ MANEJO DE EQUIPO DE PRODUCCIÓN ---
                if (dataParaGuardar.equipo_produccion.length > 0) {
                    const invitadosEquipo = dataParaGuardar.equipo_produccion.filter((e: MiembroEquipo) => e.assigned_profile_id);
                    const staffDirecto = dataParaGuardar.equipo_produccion.filter((e: MiembroEquipo) => !e.assigned_profile_id);

                    // 1. Insertar staff que es solo texto (sin perfil vinculado)
                    if (staffDirecto.length > 0) {
                        const equipoData = staffDirecto.map((e: MiembroEquipo) => ({
                            project_id: projectId,
                            username: e.username,
                            role: e.role
                        }));
                        await supabase.from('production_team').insert(equipoData);
                    }

                    // 2. Insertar invitaciones para miembros con perfil vinculado
                    if (invitadosEquipo.length > 0) {
                        const invitacionesEquipoData = invitadosEquipo.map((e: MiembroEquipo) => ({
                            project_id: projectId,
                            sender_id: user.id,
                            receiver_id: e.assigned_profile_id,
                            role: e.role, 
                            character_data: null, // No es un actor, se deja null
                            status: 'pending'
                        }));
                        await supabase.from('project_invitations').insert(invitacionesEquipoData);
                    }
                }

        return { success: true };

    } catch (error: any) {
        console.error("Error al lanzar proyecto:", error);
        Alert.alert("Error de Conexión", error.message);
        return { success: false };
    }
};
const asignarDirectorComoActor = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // Obtenemos el perfil para el nombre de usuario
        const { data: perfil } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

        setNuevoChar({
            ...nuevoChar,
            actor_dessigned: perfil?.username || 'Yo',
            assigned_profile_id: user.id
        });
    }
};

//busqueda de usuarios
    const [busquedaActores, setBusquedaActores] = useState<UserProfile[]>([]);
    const [buscando, setBuscando] = useState(false);

    const buscarActorEnBaseDeDatos = async (texto: string) => {
        if (texto.length < 2) {
            setBusquedaActores([]);
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        setBuscando(true);
        // Buscar en la tabla de perfiles
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .ilike('username', `%${texto}%`)
            .neq('id', user?.id)
            .limit(5);

        if (!error && data) {
            setBusquedaActores(data as UserProfile[]);
        }
        setBuscando(false);
    };
    
    // 1. Estados del Formulario
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        script_url: null as string | null,
        start_date: '',
        end_date: '',
        dias_funcion: [] as string[],
        equipo_produccion: [] as MiembroEquipo[],
        status: 'Activo',
        personajes: [] as Personaje[],
        theme_color: '#7C3AED',
    });

    const [nuevoChar, setNuevoChar] = useState({
        character_name: '',
        description: '',
        image_ref_url: '',
        video_ref_url: '',
        actor_dessigned: '',
        assigned_profile_id: null as string | null,
    });

    const [nuevoMiembro, setNuevoMiembro] = useState({
        username: '',
        role: '',
        assigned_profile_id: null as string | null,
    });

    // 2. Funciones de Lógica de Personajes
    const agregarPersonajeALista = () => {
        if (nuevoChar.character_name.trim() === '') return false;
        setFormData(prev => ({
            ...prev,
            personajes: [...prev.personajes, { ...nuevoChar }]
        }));
        setNuevoChar({
            character_name: '',
            description: '',
            image_ref_url: '',
            video_ref_url: '',
            actor_dessigned: '',
            assigned_profile_id: null,
        });
        return true;
    };

    const eliminarPersonaje = (index: number) => {
        setFormData(prev => ({
            ...prev,
            personajes: prev.personajes.filter((_, i) => i !== index)
        }));
    };

    // 3. Funciones de Lógica de Equipo/Fechas
    const toggleDia = (dia: string) => {
        setFormData(prev => ({
            ...prev,
            dias_funcion: prev.dias_funcion.includes(dia)
                ? prev.dias_funcion.filter(d => d !== dia)
                : [...prev.dias_funcion, dia]
        }));
    };

    const agregarMiembroEquipo = () => {
        if (nuevoMiembro.username.trim() === '') return false;
        setFormData(prev => ({
            ...prev,
            equipo_produccion: [...prev.equipo_produccion, { ...nuevoMiembro }]
        }));
        setNuevoMiembro({ username: '', role: '', assigned_profile_id: null });
        return true;
    };

    // 4. Función Reiniciar (Cancelar Producción)
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            script_url: null,
            start_date: '',
            end_date: '',
            dias_funcion: [],
            equipo_produccion: [],
            status: 'Activo',
            personajes: [],
            theme_color: '#7C3AED',
        });
    };

    //Logica para la subida de archivos
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ],
                copyToCacheDirectory: true
            });
            if (!result.canceled){
                setFormData (prev => ({
                    ...prev,
                    script_url: result.assets[0].name
                }));
                return result.assets[0];
            }
        } catch (err) {
            console.error("Error al selecionar documento:", err);
        }
    };

    return {
        formData,
        setFormData,
        nuevoChar,
        setNuevoChar,
        nuevoMiembro,
        setNuevoMiembro,
        agregarPersonajeALista,
        eliminarPersonaje,
        toggleDia,
        agregarMiembroEquipo,
        resetForm,
        pickDocument,
        busquedaActores,
        buscando,
        buscarActorEnBaseDeDatos,
        setBusquedaActores,
        guardarProyectoEnBaseDeDatos,
        
    };
};

export default useProjectForm;