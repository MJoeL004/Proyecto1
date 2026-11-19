import { Stack } from "expo-router";
import { colores } from "@/shared/theme/colores";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.primario },
        headerTintColor: colores.sobrePrimario,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Facturas electrónicas" }} />
      <Stack.Screen name="facturas/nuevo" options={{ title: "Registrar factura" }} />
      <Stack.Screen name="facturas/[id]" options={{ title: "Editar factura" }} />
    </Stack>
  );
}
