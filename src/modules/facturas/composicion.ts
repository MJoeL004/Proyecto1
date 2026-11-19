import { ActualizarFactura } from "./application/usecases/ActualizarFactura";
import { CrearFactura } from "./application/usecases/CrearFactura";
import { EliminarFactura } from "./application/usecases/EliminarFactura";
import { ObtenerFacturaPorId } from "./application/usecases/ObtenerFacturaPorId";
import { ObtenerFacturas } from "./application/usecases/ObtenerFacturas";
import { FacturaRepositorySupabase } from "./infrastructure/repositories/FacturaRepositorySupabase";

const repositorio = new FacturaRepositorySupabase();

export const crearFactura = new CrearFactura(repositorio);
export const obtenerFacturas = new ObtenerFacturas(repositorio);
export const obtenerFacturaPorId = new ObtenerFacturaPorId(repositorio);
export const actualizarFactura = new ActualizarFactura(repositorio);
export const eliminarFactura = new EliminarFactura(repositorio);
