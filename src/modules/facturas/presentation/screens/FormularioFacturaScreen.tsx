import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Boton } from "@/shared/components/Boton";
import { CampoTexto } from "@/shared/components/CampoTexto";
import { colores } from "@/shared/theme/colores";
import { useFormularioFactura } from "../hooks/useFormularioFactura";

type Props = {
  id?: string;
};

export function FormularioFacturaScreen({ id }: Props) {
  const { datos, errores, errorGeneral, cargando, guardando, cambiar, guardar } =
    useFormularioFactura(id);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <CampoTexto
        etiqueta="Número de factura"
        value={datos.numeroFactura}
        onChangeText={(texto) => cambiar("numeroFactura", texto)}
        error={errores.numeroFactura}
        placeholder="001-001-000000123"
      />
      <CampoTexto
        etiqueta="RUC del emisor"
        value={datos.rucEmisor}
        onChangeText={(texto) => cambiar("rucEmisor", texto)}
        error={errores.rucEmisor}
        keyboardType="numeric"
        maxLength={13}
        placeholder="1790012345001"
      />
      <CampoTexto
        etiqueta="Razón social"
        value={datos.razonSocial}
        onChangeText={(texto) => cambiar("razonSocial", texto)}
        error={errores.razonSocial}
        placeholder="Corporación Favorita C.A."
      />
      <CampoTexto
        etiqueta="Subtotal ($)"
        value={datos.subtotal}
        onChangeText={(texto) => cambiar("subtotal", texto)}
        error={errores.subtotal}
        keyboardType="decimal-pad"
        placeholder="100.00"
      />
      <CampoTexto
        etiqueta="Estado"
        value={datos.estado}
        onChangeText={(texto) => cambiar("estado", texto)}
        error={errores.estado}
        placeholder="Emitida o Anulada"
      />
      {errorGeneral ? <Text style={styles.errorGeneral}>{errorGeneral}</Text> : null}
      <Boton
        titulo={id === undefined ? "Guardar factura" : "Guardar cambios"}
        onPress={guardar}
        cargando={guardando}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  contenido: { padding: 16, gap: 16 },
  errorGeneral: { color: colores.error, fontSize: 14 },
});
