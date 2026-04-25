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

export const useProjectForm = () => {

const guardarProyectoEnBaseDeDatos = async (datosFinales?: any) => { 
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            Alert.alert("Error de sesión", "Debes estar logueado.");
            return { success: false };
        }

        // 2. Ahora sí, 'datosFinales' existe. Si no se manda nada, usa el formData por defecto.
        const dataParaGuardar = datosFinales || formData;

        const { data: proyectoCreado, error: errorProyecto } = await supabase
            .from('projects')
            .insert([
                {
                    title: dataParaGuardar.title,
                    description: dataParaGuardar.description,
                    script_url: dataParaGuardar.script_url,
                    start_date: dataParaGuardar.start_date,
                    end_date: dataParaGuardar.end_date,
                    dias_funcion: dataParaGuardar.dias_funcion,
                    theme_color: dataParaGuardar.theme_color,
                    status: dataParaGuardar.status, // 🚀 Usará 'Inactivo' si se calculó así
                    founder_id: user.id
                }
            ])
            .select()
            .single();
        if (errorProyecto) throw errorProyecto;

        const projectId = proyectoCreado.id;

        // 2. Insertar Personajes vinculados
        if (formData.personajes.length > 0) {
            const personajesData = formData.personajes.map(p => ({
                project_id: projectId,
                character_name: p.character_name,
                description: p.description,
                image_ref_url: p.image_ref_url,
                video_ref_url: p.video_ref_url,
                assigned_profile_id: p.assigned_profile_id
            }));
            const { error: errorChars } = await supabase.from('project_characters').insert(personajesData);
            if (errorChars) throw errorChars;
        }

        // 3. Insertar Equipo de Producción vinculado
        if (formData.equipo_produccion.length > 0) {
            const equipoData = formData.equipo_produccion.map(e => ({
                project_id: projectId,
                username: e.username,
                role: e.role
            }));
            const { error: errorEquipo } = await supabase.from('production_team').insert(equipoData);
            if (errorEquipo) throw errorEquipo;
        }

        return { success: true };

    } catch (error: any) {
        console.error("Error al lanzar proyecto:", error);
        Alert.alert("Error de Conexión", error.message);
        return { success: false };
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

        setBuscando(true);
        // Buscar en la tabla de perfiles
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .ilike('username', `%${texto}%`)
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
        equipo_produccion: [] as any[],
        status: 'Activo',
        personajes: [] as any[],
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
        role: ''
    });

    // 2. Funciones de Lógica de Personajes
    const agregarPersonajeALista = () => {
        if (nuevoChar.character_name.trim() === '') return false;
        setFormData(prev => ({
            ...prev,
            personajes: [...prev.personajes, nuevoChar]
        }));
        setNuevoChar({
            character_name: '',
            description: '',
            image_ref_url: '',
            video_ref_url: '',
            actor_dessigned: '',
            assigned_profile_id: null as string | null,
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
            equipo_produccion: [...prev.equipo_produccion, nuevoMiembro]
        }));
        setNuevoMiembro({ username: '', role: '' });
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