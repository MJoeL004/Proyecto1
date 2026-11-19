import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import type { Factura } from "../../domain/entities/Factura";
import { eliminarFactura, obtenerFacturas } from "../../composicion";

export function useFacturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setFacturas(await obtenerFacturas.ejecutar());
      setError(null);
    } catch {
      setError(
        "No se pudieron cargar las facturas. Revisa tu internet y el archivo .env."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar])
  );

  async function refrescar() {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  }

  async function eliminar(id: string): Promise<boolean> {
    try {
      await eliminarFactura.ejecutar(id);
      await cargar();
      return true;
    } catch {
      return false;
    }
  }

  return { facturas, cargando, refrescando, error, refrescar, eliminar };
}
