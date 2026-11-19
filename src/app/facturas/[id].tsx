import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

export default function EditarFactura() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registro, setRegistro] = useState<Record<string, any>>({});

  useEffect(() => {
    if (id) cargarFactura();
  }, [id]);

  const cargarFactura = async () => {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setRegistro(data);
    } catch (error: any) {
      console.error('Error cargando:', error);
      Alert.alert('Error al cargar', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    setSaving(true);
    try {
      // Quitamos campos que no se deben editar como id o created_at
      const { id: _id, created_at, ...camposEditables } = registro;

      const { data, error } = await supabase
        .from('facturas')
        .update(camposEditables)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        Alert.alert(
          'Bloqueado por Supabase (RLS)',
          'No se actualizó ninguna fila. Revisa las políticas RLS de UPDATE en tu tabla "facturas" en Supabase.'
        );
        return;
      }

      Alert.alert('Éxito', 'Cambios guardados correctamente');
      router.back();
    } catch (error: any) {
      console.error('Error guardando:', error);
      Alert.alert('Error al guardar', error.message || JSON.stringify(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Genera inputs automáticamente para las columnas reales de tu tabla
  const columnas = Object.keys(registro).filter(
    (key) => key !== 'id' && key !== 'created_at' && key !== 'user_id'
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Factura #{id}</Text>

      {columnas.map((col) => (
        <View key={col}>
          <Text style={styles.label}>{col.toUpperCase()}</Text>
          <TextInput
            style={styles.input}
            value={registro[col] !== null && registro[col] !== undefined ? String(registro[col]) : ''}
            onChangeText={(text) =>
              setRegistro((prev) => ({
                ...prev,
                [col]: typeof prev[col] === 'number' ? (text === '' ? 0 : Number(text)) : text,
              }))
            }
            keyboardType={typeof registro[col] === 'number' ? 'numeric' : 'default'}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleGuardar}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#444' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
