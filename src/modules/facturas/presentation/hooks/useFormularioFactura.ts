import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import type { DatosFactura, ErroresFactura } from "../../domain/rules/validarFactura";
import {
  actualizarFactura,
  crearFactura,
  obtenerFacturaPorId,
} from "../../composicion";

const DATOS_VACIOS: DatosFactura = {
  numeroFactura: "",
  rucEmisor: "",
  razonSocial: "",
  subtotal: "",
  estado: "Emitida",
};

export function useFormularioFactura(id?: string) {
  const router = useRouter();
  const [datos, setDatos] = useState<DatosFactura>(DATOS_VACIOS);
  const [errores, setErrores] = useState<ErroresFactura>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [cargando, setCargando] = useState(id !== undefined);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    obtenerFacturaPorId
      .ejecutar(id)
      .then((factura) => {
        if (factura) {
          setDatos({
            numeroFactura: factura.numeroFactura,
            rucEmisor: factura.rucEmisor,
            razonSocial: factura.razonSocial,
            subtotal: factura.subtotal,
            estado: factura.estado,
          });
        } else {
          setErrorGeneral("Esta factura ya no existe.");
        }
      })
      .catch(() => setErrorGeneral("No se pudo cargar la factura."))
      .finally(() => setCargando(false));
  }, [id]);

  function cambiar(campo: keyof DatosFactura, valor: string) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function guardar() {
    setGuardando(true);
    setErrorGeneral(null);
    try {
      const resultado =
        id === undefined
          ? await crearFactura.ejecutar(datos)
          : await actualizarFactura.ejecutar(id, datos);
      if (!resultado.ok) {
        setErrores(resultado.errores);
        return;
      }
      router.back();
    } catch {
      setErrorGeneral("No se pudo guardar. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return { datos, errores, errorGeneral, cargando, guardando, cambiar, guardar };
}
