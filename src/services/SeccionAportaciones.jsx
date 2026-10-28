import { useState, useEffect } from "react";
import { obtenerAportaciones, guardarAportacion, eliminarAportacion } from "../services/aportacionesService";

export default function SeccionAportaciones({ esAdmin }) {
  const [aportaciones, setAportaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    nombreFamiliar: "",
    monto: "",
    fechaAportacion: new Date().toISOString().split("T")[0],
    metodo: "transferencia",
    notas: ""
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const lista = await obtenerAportaciones();
      setAportaciones(lista);
    } catch (error) {
      console.error("Error al cargar aportaciones:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombreFamiliar || !formData.monto) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    setGuardando(true);
    try {
      await guardarAportacion(formData);
      setFormData({
        nombreFamiliar: "",
        monto: "",
        fechaAportacion: new Date().toISOString().split("T")[0],
        metodo: "transferencia",
        notas: ""
      });
      await cargarDatos();
    } catch (error) {
      alert("Error al registrar la aportación.");
    } finally {
      setGuardando(false);
    }
  };

  const handleBorrar = async (id) => {
    if (window.confirm("¿Deseas eliminar este registro de aportación?")) {
      try {
        await eliminarAportacion(id);
        await cargarDatos();
      } catch (error) {
        alert("Error al eliminar aportación.");
      }
    }
  };

  const totalAportado = aportaciones.reduce((acc, item) => acc + Number(item.monto || 0), 0);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Aportaciones Familiares</h2>
          <p className="text-sm text-gray-500">Fondos e ingresos recibidos para la atención médica</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-left sm:text-right">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Total Recaudado</span>
          <span className="text-2xl font-bold text-emerald-600">
            ${totalAportado.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Formulario solo accesible para el Administrador */}
      {esAdmin && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Registrar Nueva Aportación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600">Familiar / Donante *</label>
              <input
                type="text"
                name="nombreFamiliar"
                value={formData.nombreFamiliar}
                onChange={handleChange}
                placeholder="Ej. Tía Rosa"
                className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">Monto ($ MXN) *</label>
              <input
                type="number"
                step="0.01"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">Fecha *</label>
              <input
                type="date"
                name="fechaAportacion"
                value={formData.fechaAportacion}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">Método</label>
              <select
                name="metodo"
                value={formData.metodo}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
                <option value="deposito">Depósito</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">Detalles o Notas</label>
            <input
              type="text"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Ej. Envío directo a cuenta Banamex"
              className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
            >
              {guardando ? "Guardando..." : "Guardar Aportación"}
            </button>
          </div>
        </form>
      )}

      {/* Tabla de Registros */}
      {cargando ? (
        <p className="text-center text-sm text-gray-400 py-4">Cargando aportaciones...</p>
      ) : aportaciones.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-4">No se han registrado aportaciones familiares aún.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-3">Fecha</th>
                <th className="p-3">Familiar</th>
                <th className="p-3">Método</th>
                <th className="p-3">Notas</th>
                <th className="p-3 text-right">Monto</th>
                {esAdmin && <th className="p-3 text-center">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {aportaciones.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-gray-600 whitespace-nowrap">{item.fechaAportacion}</td>
                  <td className="p-3 font-semibold text-gray-800">{item.nombreFamiliar}</td>
                  <td className="p-3 capitalize text-gray-600">{item.metodo}</td>
                  <td className="p-3 text-gray-500 text-xs">{item.notas || "-"}</td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    ${Number(item.monto).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </td>
                  {esAdmin && (
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleBorrar(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium underline cursor-pointer"
                      >
                        Borrar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}