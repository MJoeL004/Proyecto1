import { ActualizarFactura } from "../application/usecases/ActualizarFactura";
import { CrearFactura } from "../application/usecases/CrearFactura";
import { EliminarFactura } from "../application/usecases/EliminarFactura";
import { ObtenerFacturaPorId } from "../application/usecases/ObtenerFacturaPorId";
import { ObtenerFacturas } from "../application/usecases/ObtenerFacturas";
import type { Factura } from "../domain/entities/Factura";
import type { FacturaRepository } from "../domain/ports/FacturaRepository";

class RepositorioEnMemoria implements FacturaRepository {
  facturas: Factura[] = [];

  async guardar(factura: Factura) {
    this.facturas.push(factura);
  }
  async obtenerTodos() {
    return this.facturas;
  }
  async obtenerPorId(id: string) {
    return this.facturas.find((f) => f.id === id) ?? null;
  }
  async actualizar(factura: Factura) {
    this.facturas = this.facturas.map((f) => (f.id === factura.id ? factura : f));
  }
  async eliminar(id: string) {
    this.facturas = this.facturas.filter((f) => f.id !== id);
  }
}

const datosValidos = {
  numeroFactura: "001-001-000000123",
  rucEmisor: "1790012345001",
  razonSocial: "Corporación Favorita C.A.",
  subtotal: "100.00",
  estado: "Emitida",
};

describe("CrearFactura", () => {
  it("guarda una factura válida y le asigna un id", async () => {
    const repo = new RepositorioEnMemoria();
    const resultado = await new CrearFactura(repo).ejecutar(datosValidos);
    expect(resultado.ok).toBe(true);
    expect(repo.facturas).toHaveLength(1);
    expect(repo.facturas[0].id).not.toBe("");
    expect(repo.facturas[0].razonSocial).toBe("Corporación Favorita C.A.");
  });

  it("no guarda si hay campos inválidos y devuelve los errores", async () => {
    const repo = new RepositorioEnMemoria();
    const resultado = await new CrearFactura(repo).ejecutar({
      ...datosValidos,
      numeroFactura: "123",
      rucEmisor: "1790",
    });
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(Object.keys(resultado.errores).sort()).toEqual([
        "numeroFactura",
        "rucEmisor",
      ]);
    }
    expect(repo.facturas).toHaveLength(0);
  });
});

describe("ObtenerFacturas", () => {
  it("devuelve las facturas ordenadas alfabéticamente por razón social", async () => {
    const repo = new RepositorioEnMemoria();
    const crear = new CrearFactura(repo);
    await crear.ejecutar({ ...datosValidos, razonSocial: "Supermaxi S.A." });
    await crear.ejecutar({ ...datosValidos, razonSocial: "Almacenes De Prati" });

    const lista = await new ObtenerFacturas(repo).ejecutar();
    expect(lista.map((f) => f.razonSocial)).toEqual([
      "Almacenes De Prati",
      "Supermaxi S.A.",
    ]);
  });
});

describe("ObtenerFacturaPorId", () => {
  it("devuelve la factura si existe y null si no existe", async () => {
    const repo = new RepositorioEnMemoria();
    const creado = await new CrearFactura(repo).ejecutar(datosValidos);
    if (!creado.ok) throw new Error("No se pudo crear");

    const caso = new ObtenerFacturaPorId(repo);
    expect((await caso.ejecutar(creado.factura.id))?.razonSocial).toBe(
      "Corporación Favorita C.A."
    );
    expect(await caso.ejecutar("no-existe")).toBeNull();
  });
});

describe("ActualizarFactura", () => {
  it("cambia los datos de la factura y conserva su id", async () => {
    const repo = new RepositorioEnMemoria();
    const creado = await new CrearFactura(repo).ejecutar(datosValidos);
    if (!creado.ok) throw new Error("No se pudo crear");

    const resultado = await new ActualizarFactura(repo).ejecutar(
      creado.factura.id,
      { ...datosValidos, estado: "Anulada" }
    );
    expect(resultado.ok).toBe(true);
    expect(repo.facturas[0].id).toBe(creado.factura.id);
    expect(repo.facturas[0].estado).toBe("Anulada");
  });
});

describe("EliminarFactura", () => {
  it("elimina solo la factura indicada", async () => {
    const repo = new RepositorioEnMemoria();
    const crear = new CrearFactura(repo);
    const a = await crear.ejecutar({ ...datosValidos, numeroFactura: "001-001-000000001" });
    await crear.ejecutar({ ...datosValidos, numeroFactura: "001-001-000000002" });
    if (!a.ok) throw new Error("No se pudo crear");

    await new EliminarFactura(repo).ejecutar(a.factura.id);
    expect(repo.facturas.map((f) => f.numeroFactura)).toEqual(["001-001-000000002"]);
  });
});
