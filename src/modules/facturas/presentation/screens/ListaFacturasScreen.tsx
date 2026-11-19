import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Boton } from "@/shared/components/Boton";
import { colores } from "@/shared/theme/colores";
import type { Factura } from "../../domain/entities/Factura";
import { FacturaCard } from "../components/FacturaCard";
import { useFacturas } from "../hooks/useFacturas";

export function ListaFacturasScreen() {
  const router = useRouter();
  const { facturas, cargando, refrescando, error, refrescar, eliminar } =
    useFacturas();

  function confirmarEliminar(factura: Factura) {
    if (Platform.OS === "web") {
      if (window.confirm(`¿Eliminar "${factura.numeroFactura}"? No se puede deshacer.`)) {
        void eliminar(factura.id);
      }
      return;
    }

    Alert.alert(
      "Eliminar factura",
      `¿Eliminar "${factura.numeroFactura}"? No se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const eliminado = await eliminar(factura.id);
            if (!eliminado) Alert.alert("Error", "No se pudo eliminar la factura.");
          },
        },
      ]
    );
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={facturas}
        keyExtractor={(factura) => factura.id}
        renderItem={({ item }) => (
          <FacturaCard
            factura={item}
            onEditar={() =>
              router.push({ pathname: "/facturas/[id]", params: { id: item.id } })
            }
            onEliminar={() => confirmarEliminar(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no hay facturas registradas.</Text>
        }
        contentContainerStyle={styles.lista}
        refreshing={refrescando}
        onRefresh={refrescar}
      />
      <View style={styles.pie}>
        <Boton
          titulo="Registrar factura"
          onPress={() => router.push("/facturas/nuevo")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  lista: { padding: 16 },
  separador: { height: 12 },
  vacio: { textAlign: "center", color: colores.textoSuave, marginTop: 32 },
  error: { color: colores.error, fontSize: 16, textAlign: "center" },
  pie: { padding: 16 },
});
