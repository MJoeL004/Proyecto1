import type { Factura } from "../entities/Factura";

export type DatosFactura = Omit<Factura, "id">;
export type ErroresFactura = Partial<Record<keyof DatosFactura, string>>;

export function validarFactura(datos: DatosFactura): ErroresFactura {
  const errores: ErroresFactura = {};

  if (!/^\d{3}-\d{3}-\d{9}$/.test(datos.numeroFactura.trim())) {
    errores.numeroFactura = "Formato requerido: 001-001-000000123.";
  }
  if (!/^\d{13}$/.test(datos.rucEmisor.trim())) {
    errores.rucEmisor = "El RUC debe tener exactamente 13 dígitos.";
  }
  if (datos.razonSocial.trim().length < 3) {
    errores.razonSocial = "La razón social debe tener al menos 3 caracteres.";
  }
  const monto = Number(datos.subtotal.trim().replace(",", "."));
  if (datos.subtotal.trim() === "" || isNaN(monto) || monto <= 0) {
    errores.subtotal = "Ingresa un subtotal válido mayor a 0.";
  }
  if (datos.estado.trim().length === 0) {
    errores.estado = "Escribe un estado (por ejemplo: Emitida o Anulada).";
  }

  return errores;
}

export function limpiarDatos(datos: DatosFactura): DatosFactura {
  return {
    numeroFactura: datos.numeroFactura.trim(),
    rucEmisor: datos.rucEmisor.trim(),
    razonSocial: datos.razonSocial.trim(),
    subtotal: datos.subtotal.trim().replace(",", "."),
    estado: datos.estado.trim(),
  };
}
