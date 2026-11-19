import type { Factura } from "../../domain/entities/Factura";
import type { FacturaRepository } from "../../domain/ports/FacturaRepository";
import {
  limpiarDatos,
  validarFactura,
  type DatosFactura,
  type ErroresFactura,
} from "../../domain/rules/validarFactura";

export type ResultadoActualizarFactura =
  | { ok: true; factura: Factura }
  | { ok: false; errores: ErroresFactura };

export class ActualizarFactura {
  constructor(private readonly repositorio: FacturaRepository) {}

  async ejecutar(
    id: string,
    datos: DatosFactura
  ): Promise<ResultadoActualizarFactura> {
    const limpios = limpiarDatos(datos);
    const errores = validarFactura(limpios);
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }
    const factura: Factura = { id, ...limpios };
    await this.repositorio.actualizar(factura);
    return { ok: true, factura };
  }
}
