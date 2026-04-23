import { useState } from 'react';

export const useProjectForm = () => {
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
        resetForm
    };
};