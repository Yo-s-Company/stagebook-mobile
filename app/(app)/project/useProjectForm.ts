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

    
export const useProjectForm = (initialProjectId?: string) => {
    const [formData, setFormData] = useState({
        id: initialProjectId || null, // ✅ Usamos 'id' consistentemente
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        script_url: '',
        dias_funcion: [] as string[],
        status: 'Activo',
        theme_color: '#7C3AED',
        personajes: [] as Personaje[],
        equipo_produccion: [] as MiembroEquipo[],
    });

    const [archivoFisico, setArchivoFisico] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

    // 1. Cargar datos para edición
    const cargarDatosParaEditar = async (id: string) => {
        const { data, error } = await supabase
            .from('projects')
            .select('*, project_characters(*)')
            .eq('id', id)
            .single();

        if (data && !error) {
            setFormData({
                ...data,
                personajes: data.project_characters || [],
                equipo_produccion: [], // Cargar si tienes tabla de equipo
            });
        }
    };

    // 2. Guardar (Híbrido: Insert o Update)
    const guardarProyectoEnBaseDeDatos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Debes estar logueado.");

            const esEdicion = !!formData.id;
            let projectId = formData.id;

            const payload = {
                title: formData.title,
                description: formData.description,
                start_date: formData.start_date,
                end_date: formData.end_date,
                dias_funcion: formData.dias_funcion,
                theme_color: formData.theme_color,
                status: formData.status,
                founder_id: user.id,
            };

            if (esEdicion) {
                // ✅ ACTUALIZAR
                const { error } = await supabase
                    .from('projects')
                    .update(payload)
                    .eq('id', projectId);
                if (error) throw error;
            } else {
                // ✅ INSERTAR
                const { data, error } = await supabase
                    .from('projects')
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                projectId = data.id;
            }

            // 3. Manejo de Archivo (Script)
            if (archivoFisico && projectId) {
                const filePath = `${projectId}/${archivoFisico.name}`;
                const response = await fetch(archivoFisico.uri);
                const arrayBuffer = await response.arrayBuffer();

                const { error: uploadError } = await supabase.storage
                    .from('project_scripts')
                    .upload(filePath, arrayBuffer, {
                        contentType: archivoFisico.mimeType || 'application/pdf',
                        upsert: true
                    });

                if (!uploadError) {
                    await supabase.from('projects').update({ script_url: filePath }).eq('id', projectId);
                }
            }

            // 4. Sincronizar Personajes (Borrar y Re-insertar es lo más seguro en edición simple)
            if (projectId) {
                await supabase.from('project_characters').delete().eq('project_id', projectId);
                
                if (formData.personajes.length > 0) {
                    const personajesParaInsertar = formData.personajes.map((p: any) => ({
                        project_id: projectId,
                        character_name: p.character_name,
                        description: p.description || '',
                        assigned_profile_id: p.assigned_profile_id || null,
                    }));
                    await supabase.from('project_characters').insert(personajesParaInsertar);
                }
            }

            return { success: true, projectId };
        } catch (error: any) {
            Alert.alert("Error", error.message);
            return { success: false };
        }
    };

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
            if (!result.canceled) {
                setFormData(prev => ({
                    ...prev,
                    script_url: result.assets[0].name
                }));
                setArchivoFisico(result.assets[0]); 
                return result.assets[0];
            }
        } catch (err) {
            console.error("Error al seleccionar documento:", err);
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
            id: '',
            title: '',
            description: '',
            script_url: '',
            start_date: '',
            end_date: '',
            dias_funcion: [],
            equipo_produccion: [],
            status: 'Activo',
            personajes: [],
            theme_color: '#7C3AED',
        });
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
        cargarDatosParaEditar
        
    };
};

export default useProjectForm;