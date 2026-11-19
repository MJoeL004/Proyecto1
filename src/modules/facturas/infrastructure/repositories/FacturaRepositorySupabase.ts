import { supabase } from "@/core/supabase/cliente";
import type { Factura } from "../../domain/entities/Factura";
import type { FacturaRepository } from "../../domain/ports/FacturaRepository";

const TABLA = "facturas";

type FilaFactura = {
  id: string;
  numero_factura: string;
  ruc_emisor: string;
  razon_social: string;
  subtotal: string;
  estado: string;
};

function aEntidad(fila: FilaFactura): Factura {
  return {
    id: fila.id,
    numeroFactura: fila.numero_factura,
    rucEmisor: fila.ruc_emisor,
    razonSocial: fila.razon_social,
    subtotal: fila.subtotal,
    estado: fila.estado,
  };
}

function aFila(factura: Factura): FilaFactura {
  return {
    id: factura.id,
    numero_factura: factura.numeroFactura,
    ruc_emisor: factura.rucEmisor,
    razon_social: factura.razonSocial,
    subtotal: factura.subtotal,
    estado: factura.estado,
  };
}

export class FacturaRepositorySupabase implements FacturaRepository {
  async obtenerTodos(): Promise<Factura[]> {
    const { data, error } = await supabase.from(TABLA).select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(aEntidad);
  }

  async obtenerPorId(id: string): Promise<Factura | null> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? aEntidad(data) : null;
  }

  async guardar(factura: Factura): Promise<void> {
    const { error } = await supabase.from(TABLA).insert(aFila(factura));
    if (error) throw new Error(error.message);
  }

  async actualizar(factura: Factura): Promise<void> {
    const { data, error } = await supabase
      .from(TABLA)
      .update(aFila(factura))
      .eq("id", factura.id)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error(
        "No se actualizó ninguna fila: la factura no existe o falta la política RLS."
      );
    }
  }

  async eliminar(id: string): Promise<void> {
    const { data, error } = await supabase
      .from(TABLA)
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error(
        "No se eliminó ninguna fila: la factura no existe o falta la política RLS."
      );
    }
  }
}
