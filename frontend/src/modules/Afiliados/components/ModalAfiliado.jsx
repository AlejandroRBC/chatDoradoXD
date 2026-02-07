import { Modal, Group, Text, Button, TextInput, Select, Checkbox, Stack, Box, FileInput, Divider } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { useState } from 'react';

const ModalAfiliado = ({ opened, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ci: '',
    expedido: 'LP',
    nombre: '',
    apellido: '',
    puestoId: '',
    tienePatente: false,
    foto: null,
    rubro:''
  });

  const departamentos = [
    { value: 'LP', label: 'La Paz' },
    { value: 'CB', label: 'Cochabamba' },
    { value: 'SC', label: 'Santa Cruz' },
    { value: 'OR', label: 'Oruro' },
    { value: 'PT', label: 'Potosí' },
    { value: 'TJ', label: 'Tarija' },
    { value: 'CH', label: 'Chuquisaca' },
    { value: 'BE', label: 'Beni' },
    { value: 'PD', label: 'Pando' }
  ];

  // Lista de puestos disponibles (simulada por ahora)
  const puestosDisponibles = [
    { value: '1', label: 'Puesto 1 A - 1ra cuadra' },
    { value: '2', label: 'Puesto 12 A - 1ra cuadra' },
    { value: '3', label: 'Puesto 21 B - 2da cuadra' },
    { value: '4', label: 'Puesto 22 B - 2da cuadra' },
    { value: '5', label: 'Puesto 101 C - 3ra cuadra' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (file) => {
    handleChange('foto', file);
  };

  const handleSubmit = () => {
    // Validaciones básicas
    if (!formData.ci || !formData.nombre || !formData.apellido || !formData.rubro) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    if (formData.ci.length < 5) {
      alert('El CI debe tener al menos 5 dígitos');
      return;
    }

    // Preparar datos para enviar
    const afiliadoData = {
      ci: formData.ci,
      extension: formData.expedido,
      nombre: formData.nombre,
      paterno: formData.paterno,
      materno: formData.materno,
      tiene_patente: formData.tienePatente,
      id_puesto: formData.puestoId || null,
      rubro: formData.rubro
    };

    console.log('Datos del afiliado:', afiliadoData);
    
    if (onSubmit) {
      onSubmit(afiliadoData);
    }
    
    // Resetear formulario y cerrar modal
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      ci: '',
      expedido: 'LP',
      nombre: '',
      apellido: '',
      puestoId: '',
      tienePatente: false,
      foto: null
    });
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      size="lg"
      title={
        <Group justify="space-between" w="100%">
          <Text fw={700} size="xl">AÑADIR AFILIADO</Text>
          <Divider style={{ flex: 1 }} />
        </Group>
      }
      centered
      styles={{
        header: {
          backgroundColor: '#f6f8fe',
          padding: '20px',
          borderBottom: '1px solid #eee'
        },
        body: {
          padding: '0'
        }
      }}
    >
      <Box p="lg">
        <Group align="flex-start" gap="xl">
          {/* Columna izquierda - Foto de perfil */}
          <Stack gap="md" style={{ width: '200px' }}>
            <Box
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                border: '2px dashed #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9',
                backgroundImage: 'url(/assets/preview.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
              }}
            >
              {formData.foto ? (
                <>
                  <img
                    src={URL.createObjectURL(formData.foto)}
                    alt="Vista previa"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.7
                    }}
                  />
                  <Button
                    variant="subtle"
                    size="xs"
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      padding: '2px 6px',
                      minWidth: 'auto'
                    }}
                    onClick={() => handleChange('foto', null)}
                  >
                    <IconX size={14} />
                  </Button>
                </>
              ) : (
                <Stack align="center" gap="xs">
                  <IconPhoto size={48} style={{ color: '#999' }} />
                  <Text size="sm" style={{ color: '#666', textAlign: 'center' }}>
                    Vista previa
                  </Text>
                </Stack>
              )}
            </Box>

            <FileInput
              label="Subir foto"
              placeholder="Seleccionar archivo"
              leftSection={<IconUpload size={16} />}
              accept="image/*"
              value={formData.foto}
              onChange={handleFileChange}
              clearable
              styles={{
                input: {
                  backgroundColor: '#f6f8fe',
                  border: '1px solid #f6f8fe',
                }
              }}
            />
          </Stack>

          {/* Columna derecha - Formulario */}
          <Stack gap="md" style={{ flex: 1 }}>
            {/* CI y Expedido en una línea */}
            <Group grow>
              <TextInput
                label="CI"
                placeholder="Ej: 1234567"
                value={formData.ci}
                onChange={(e) => handleChange('ci', e.target.value)}
                styles={{
                  input: {
                    backgroundColor: '#f6f8fe',
                    border: '1px solid #f6f8fe',
                  }
                }}
                required
              />
              
              <Select
                label="Expedido"
                data={departamentos}
                value={formData.expedido}
                onChange={(value) => handleChange('expedido', value)}
                styles={{
                  input: {
                    backgroundColor: '#f6f8fe',
                    border: '1px solid #f6f8fe',
                  }
                }}
              />
            </Group>

            {/* Nombre y Apellido */}
            <Group grow>
              <TextInput
                label="Nombre"
                placeholder="Ej: Juan"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                styles={{
                  input: {
                    backgroundColor: '#f6f8fe',
                    border: '1px solid #f6f8fe',
                  }
                }}
                required
              />
              
              <TextInput
                label="Paterno"
                placeholder="Ej: Pérez"
                value={formData.paterno}
                onChange={(e) => handleChange('apellido', e.target.value)}
                styles={{
                  input: {
                    backgroundColor: '#f6f8fe',
                    border: '1px solid #f6f8fe',
                  }
                }}
                required
              />
              <TextInput
                label="Materno"
                placeholder="Ej: Velazco"
                value={formData.materno}
                onChange={(e) => handleChange('apellido', e.target.value)}
                styles={{
                  input: {
                    backgroundColor: '#f6f8fe',
                    border: '1px solid #f6f8fe',
                  }
                }}
                required
              />
            </Group>

            {/* Puestos Asignados */}
            <Box>
              <Text fw={600} size="sm" style={{ color: '#0f0f0f', marginBottom: '8px' }}>
                Puestos Asignados:
              </Text>
              <Select
                placeholder="Seleccionar puesto"
                data={puestosDisponibles}
                value={formData.puestoId}
                onChange={(value) => handleChange('puestoId', value)}
                clearable
                styles={{
                  input: {
                    backgroundColor: '#f6f8fe',
                    border: '1px solid #f6f8fe',
                  }
                }}
              />
              <TextInput
                label="Rubro"
                placeholder="Ej: Electronicos"
                value={formData.rubro}
                onChange={(e) => handleChange('rubro', e.target.value)}
                styles={{
                  input: {
                    backgroundColor: '#f6f8fe',
                    border: '1px solid #f6f8fe',
                  }
                }}
                required
              />
            </Box>

            {/* Checkbox de Patente */}
            <Checkbox
              label="¿Tiene Patente?"
              checked={formData.tienePatente}
              onChange={(e) => handleChange('tienePatente', e.target.checked)}
              styles={{
                label: {
                  color: '#0f0f0f',
                  fontWeight: 500
                }
              }}
            />
          </Stack>
        </Group>

        {/* Botones de acción */}
        <Group justify="flex-end" gap="md" mt="xl" pt="md" style={{ borderTop: '1px solid #eee' }}>
          <Button
            variant="outline"
            style={{
              backgroundColor: '#0f0f0f',
              color: 'white',
              border: '1px solid #0f0f0f',
              borderRadius: '100px',
              padding: '10px 30px',
              fontWeight: 500,
            }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          
          <Button
            style={{
              backgroundColor: '#EDBE3C',
              color: '#0f0f0f',
              borderRadius: '100px',
              padding: '10px 30px',
              fontWeight: 600,
              border: '1px solid #EDBE3C',
              '&:hover': {
                backgroundColor: '#d4a933',
              }
            }}
            onClick={handleSubmit}
          >
            Aceptar
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};

export default ModalAfiliado;