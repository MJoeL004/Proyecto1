import type { Factura } from "../entities/Factura";

export interface FacturaRepository {
  guardar(factura: Factura): Promise<void>;
  obtenerTodos(): Promise<Factura[]>;
  obtenerPorId(id: string): Promise<Factura | null>;
  actualizar(factura: Factura): Promise<void>;
  eliminar(id: string): Promise<void>;
}
