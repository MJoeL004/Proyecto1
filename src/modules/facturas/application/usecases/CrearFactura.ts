import type { Factura } from "../../domain/entities/Factura";
import type { FacturaRepository } from "../../domain/ports/FacturaRepository";
import {
  limpiarDatos,
  validarFactura,
  type DatosFactura,
  type ErroresFactura,
} from "../../domain/rules/validarFactura";

export type ResultadoCrearFactura =
  | { ok: true; factura: Factura }
  | { ok: false; errores: ErroresFactura };

function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class CrearFactura {
  constructor(private readonly repositorio: FacturaRepository) {}

  async ejecutar(datos: DatosFactura): Promise<ResultadoCrearFactura> {
    const limpios = limpiarDatos(datos);
    const errores = validarFactura(limpios);
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }
    const factura: Factura = { id: generarId(), ...limpios };
    await this.repositorio.guardar(factura);
    return { ok: true, factura };
  }
}
