import type { Factura } from "../../domain/entities/Factura";
import type { FacturaRepository } from "../../domain/ports/FacturaRepository";

export class ObtenerFacturaPorId {
  constructor(private readonly repositorio: FacturaRepository) {}

  async ejecutar(id: string): Promise<Factura | null> {
    return this.repositorio.obtenerPorId(id);
  }
}
