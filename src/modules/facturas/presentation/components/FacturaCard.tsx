import { Pressable, StyleSheet, Text, View } from "react-native";
import { colores } from "@/shared/theme/colores";
import type { Factura } from "../../domain/entities/Factura";

type Props = {
  factura: Factura;
  onEditar: () => void;
  onEliminar: () => void;
};

export function FacturaCard({ factura, onEditar, onEliminar }: Props) {
  const sub = parseFloat(factura.subtotal) || 0;
  const total = (sub * 1.15).toFixed(2);

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.estado}>{factura.estado}</Text>
      <Text style={styles.nombre}>{factura.razonSocial}</Text>
      <Text style={styles.detalle}>Factura: {factura.numeroFactura}</Text>
      <Text style={styles.detalle}>RUC: {factura.rucEmisor}</Text>
      <Text style={styles.monto}>
        Subtotal: ${sub.toFixed(2)} | Total (IVA 15%): ${total}
      </Text>
      <View style={styles.acciones}>
        <Pressable onPress={onEditar} accessibilityRole="button">
          <Text style={styles.accion}>Editar</Text>
        </Pressable>
        <Pressable onPress={onEliminar} accessibilityRole="button">
          <Text style={[styles.accion, styles.peligro]}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 16,
    gap: 4,
  },
  estado: {
    fontSize: 12,
    fontWeight: "700",
    color: colores.primario,
    textTransform: "uppercase",
  },
  nombre: { fontSize: 18, fontWeight: "700", color: colores.texto },
  detalle: { fontSize: 14, color: colores.textoSuave },
  monto: { fontSize: 15, fontWeight: "600", color: colores.texto, marginTop: 4 },
  acciones: { flexDirection: "row", gap: 24, marginTop: 12 },
  accion: { fontSize: 15, fontWeight: "700", color: colores.primario },
  peligro: { color: colores.error },
});
