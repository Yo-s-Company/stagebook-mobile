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
    const [formData, setFormData] = useState({
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

    // Guardamos el asset completo del archivo para la subida posterior
    const [archivoFisico, setArchivoFisico] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

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

    const guardarProyectoEnBaseDeDatos = async (datosFinales?: any) => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                Alert.alert("Error de sesión", "Debes estar logueado.");
                return { success: false };
            }

            const dataParaGuardar = datosFinales || formData;

            // 1. Insertar el Proyecto primero para obtener su ID
            const { data: proyectoCreado, error: errorProyecto } = await supabase
                .from('projects')
                .insert({
                    title: dataParaGuardar.title,
                    description: dataParaGuardar.description,
                    start_date: dataParaGuardar.start_date,
                    end_date: dataParaGuardar.end_date,
                    dias_funcion: dataParaGuardar.dias_funcion,
                    theme_color: dataParaGuardar.theme_color,
                    status: dataParaGuardar.status,
                    founder_id: user.id,
                })
                .select()
                .single();

            if (errorProyecto) throw errorProyecto;
            const projectId = proyectoCreado.id;

            // 2. Subir el libreto si existe
            if (archivoFisico) {
                const filePath = `${projectId}/${archivoFisico.name}`;
            try{
                const response = await fetch(archivoFisico.uri);
                const arrayBuffer = await response.arrayBuffer();

                // 2. Subir el buffer directamente
                const { error: uploadError } = await supabase.storage
                    .from('project_scripts')
                    .upload(filePath, arrayBuffer, {
                    contentType: archivoFisico.name.endsWith('.docx') 
                        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
                        : (archivoFisico.mimeType || 'application/pdf'),
                    upsert: true,
                    cacheControl: '3600'
                    });

                if (!uploadError) {
                    const {error: updateError} =await supabase
                        .from('projects')
                        .update({ script_url: filePath })
                        .eq('id', projectId);

                    if (updateError) throw updateError;
                } else {
                    throw uploadError;
                }
            } catch (uploadError: any){
                console.error("Error crítico en la subida:", uploadError);
            }
        }

            // 4. Insertar Personajes
            if (dataParaGuardar.personajes.length > 0) {
                const personajesParaInsertar = dataParaGuardar.personajes.map((p: any) => ({
                    project_id: projectId,
                    character_name: p.character_name,
                    description: p.description || '',
                    image_ref_url: p.image_ref_url || null,
                    video_ref_url: p.video_ref_url || null,
                    assigned_profile_id: p.assigned_profile_id || null,
                }));
                const { error: errorChars } = await supabase.from('project_characters').insert(personajesParaInsertar);
                if (errorChars) throw errorChars;
            }

            // 5. Enviar Invitaciones al equipo
            if (dataParaGuardar.equipo_produccion.length > 0) {
                const invitaciones = dataParaGuardar.equipo_produccion.map((m: any) => ({
                    project_id: projectId,
                    receiver_id: m.assigned_profile_id,
                    role: m.role,
                    status: 'pending'
                }));
                const { error: errorInvs } = await supabase.from('project_invitations').insert(invitaciones);
                if (errorInvs) throw errorInvs;
            }

            return { success: true, projectId };
        } catch (error: any) {
            console.error("Error al crear proyecto:", error);
            Alert.alert("Error", error.message);
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
        
    };
};

export default useProjectForm;