import { useState, useEffect } from "react";
import FormularioGasto from "./components/FormularioGasto";
import TablaGastos from "./components/TablaGastos";
import { guardarGasto, obtenerGastos } from "./services/gastosService";

export default function App() {
  const [gastos, setGastos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [conectadoFirebase, setConectadoFirebase] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const lista = await obtenerGastos();
      setGastos(lista);
      setConectadoFirebase(true);
    } catch (error) {
      console.error("Error al cargar datos desde Firebase:", error);
      setConectadoFirebase(false);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleNuevoGasto = async (nuevoGasto) => {
    setGuardando(true);
    try {
      await guardarGasto(nuevoGasto);
      await cargarDatos();
    } catch (error) {
      alert("Ocurrió un error al intentar guardar el gasto.");
    } finally {
      setGuardando(false);
    }
  };

  const totalPagado = gastos
    .filter((g) => g.estatus !== "presupuesto")
    .reduce((acc, item) => acc + Number(item.monto), 0);

  const totalPresupuestado = gastos
    .filter((g) => g.estatus === "presupuesto")
    .reduce((acc, item) => acc + Number(item.monto), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-8">
      <div className="w-full max-w-full space-y-6">
        <header className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">Control de Gastos Médicos - Jesús</h1>
              
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                <span className={`w-2 h-2 rounded-full ${conectadoFirebase ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
                {conectadoFirebase ? "Conectado a Firebase" : "Conectando..."}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Bitácora familiar centralizada</p>
          </div>

          <div className="text-left md:text-right w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Total Pagado</p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalPagado.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="mt-1">
              <p className="text-xs font-semibold text-amber-600">
                Presupuestado: ${totalPresupuestado.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </header>

        <FormularioGasto onGastoAgregado={handleNuevoGasto} guardando={guardando} />

        <div className="w-full space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Historial y Desglose por Categoría</h2>
          {cargando ? (
            <p className="text-center text-gray-500 py-4">Cargando registros desde Firebase...</p>
          ) : (
            <TablaGastos gastos={gastos} onEstatusCambiado={cargarDatos} />
          )}
        </div>
      </div>
    </div>
  );
}