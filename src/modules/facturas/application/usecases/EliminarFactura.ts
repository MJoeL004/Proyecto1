import type { FacturaRepository } from "../../domain/ports/FacturaRepository";

export class EliminarFactura {
  constructor(private readonly repositorio: FacturaRepository) {}

  async ejecutar(id: string): Promise<void> {
    await this.repositorio.eliminar(id);
  }
}
