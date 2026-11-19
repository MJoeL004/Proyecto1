import type { Factura } from "../../domain/entities/Factura";
import type { FacturaRepository } from "../../domain/ports/FacturaRepository";

export class ObtenerFacturas {
  constructor(private readonly repositorio: FacturaRepository) {}

  async ejecutar(): Promise<Factura[]> {
    const facturas = await this.repositorio.obtenerTodos();
    return [...facturas].sort((a, b) =>
      a.razonSocial.localeCompare(b.razonSocial, "es")
    );
  }
}
