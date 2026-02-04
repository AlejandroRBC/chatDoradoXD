import { useState } from 'react';
import { afiliadosService } from '../services/afiliadosService';

export function useAfiliadoAdd() {
    const [formData, setFormData] = useState(getInitialFormData());
    const [imagenPreview, setImagenPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    function getInitialFormData() {
        return {
            ci: '',
            extension: 'LP',
            nombre: '',
            paterno: '',
            materno: '',
            sexo: 'M',
            fecNac: '',
            telefono: '',
            ocupacion: '',
            direccion: '',
            estado: true,
            url_perfil: '/assets/perfiles/sinPerfil.png'
        };
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Manejar selección de imagen - simplificado
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.match('image.*')) {
            setError('Por favor selecciona una imagen válida (JPG, PNG, GIF)');
            return;
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen no debe exceder los 5MB');
            return;
        }

        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagenPreview(reader.result);
            // Actualizar la URL en formData
            setFormData(prev => ({
                ...prev,
                url_perfil: reader.result // URL temporal para preview
            }));
        };
        reader.readAsDataURL(file);
    };

    // Eliminar imagen seleccionada
    const handleRemoveImage = () => {
        setImagenPreview(null);
        setFormData(prev => ({
            ...prev,
            url_perfil: '/assets/perfiles/sinPerfil.png'
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Si hay preview, significa que se seleccionó una nueva imagen
            let datosAfiliado = { ...formData };
            
            if (imagenPreview && imagenPreview.startsWith('data:image')) {
                // En un sistema real, aquí convertirías el DataURL a archivo
                // y lo subirías al servidor
                // Por ahora, simulamos una URL
                const nombreArchivo = `perfil_${formData.ci}_${Date.now()}.jpg`;
                datosAfiliado.url_perfil = `/assets/perfiles/${nombreArchivo}`;
            }
            
                datosAfiliado.url_perfil = `/assets/perfiles/sinPerfil.png`;

            const response = await afiliadosService.createAfiliado(datosAfiliado);
            if (response.success) {
                setSuccess(true);
                resetForm();
                return response.data;
            } else {
                setError('Error al crear afiliado');
                return null;
            }
        } catch (err) {
            setError(err.message || 'Error al conectar con el servidor');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(getInitialFormData());
        setImagenPreview(null);
        setError('');
        setSuccess(false);
    };

    const setFieldValue = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    return {
        formData,
        imagenPreview,
        loading,
        error,
        success,
        handleChange,
        handleImageChange,
        handleRemoveImage,
        handleSubmit,
        resetForm,
        setFieldValue
    };
}