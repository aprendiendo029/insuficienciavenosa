import { useState } from "react";
import { actualizarEstatusGasto, eliminarGasto } from "../services/gastosService";

export default function TablaGastos({ gastos, onEstatusCambiado }) {
  const [registrosSeleccionados, setRegistrosSeleccionados] = useState([]);

  // Rutas actualizadas de Google Drive
  const enlacesDrive = {
    estudios: "https://drive.google.com/drive/folders/1EfJd6Owxq1BSoAPHhAvRLGFw66PHhM8y?usp=share_link",
    medicamentos: "https://drive.google.com/drive/folders/1S0NCZq30oI_FViOefsqAxkgwLW5iBSSX?usp=share_link",
    lesion: "https://drive.google.com/drive/folders/1Eg3aaXpmQK4L3Fao1fitZ3OsYMVzV6Nl?usp=share_link"
  };

  const nombresCategorias = {
    consultas: "Consultas y Honorarios",
    medicamentos: "Medicamentos y Farmacia",
    estudios: "Estudios y Laboratorio",
    transporte: "Transporte y Traslados",
    varios: "Otros / Varios"
  };

  // Formato para extraer sólo la fecha corta y el día de la semana (lunes, martes, etc.)
  const formatearFechaLarga = (fechaStr) => {
    if (!fechaStr) return { corto: "", diaSemana: "" };
    const [año, mes, dia] = fechaStr.split("-");
    const fechaObj = new Date(Number(año), Number(mes) - 1, Number(dia));
    
    const diaTexto = fechaObj.toLocaleDateString("es-MX", { weekday: "long" });
    const añoCorto = año.slice(-2);

    return {
      corto: `${dia}/${mes}/${añoCorto}`,
      diaSemana: diaTexto
    };
  };

  const handleToggleSeleccion = (id) => {
    setRegistrosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCambioEstatus = async (id, nuevoEstatus) => {
    try {
      await actualizarEstatusGasto(id, nuevoEstatus);
      if (onEstatusCambiado) onEstatusCambiado();
    } catch (error) {
      alert("Error al actualizar el estatus del gasto");
    }
  };

  const handleBorrarSeleccionados = async () => {
    if (registrosSeleccionados.length === 0) return;

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar los ${registrosSeleccionados.length} registro(s) seleccionado(s)?`
    );

    if (confirmacion) {
      try {
        await Promise.all(registrosSeleccionados.map((id) => eliminarGasto(id)));
        setRegistrosSeleccionados([]);
        if (onEstatusCambiado) onEstatusCambiado();
      } catch (error) {
        alert("Error al intentar eliminar los gastos seleccionados");
      }
    }
  };

  const subtotalesPagados = (gastos || [])
    .filter((g) => g.estatus !== "presupuesto")
    .reduce((acc, gasto) => {
      const cat = gasto.categoriaId || "varios";
      acc[cat] = (acc[cat] || 0) + Number(gasto.monto);
      return acc;
    }, {});

  const gastosPagados = (gastos || []).filter((g) => g.estatus !== "presupuesto");
  const gastosPresupuesto = (gastos || []).filter((g) => g.estatus === "presupuesto");

  const renderTabla = (listaGastos, titulo, bgBadge, textBadge) => (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
          <span>{titulo}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${bgBadge} ${textBadge}`}>
            {listaGastos.length} registro(s)
          </span>
        </h3>
      </div>

      {listaGastos.length === 0 ? (
        <div className="p-6 text-center text-gray-400 text-sm">
          No hay gastos en esta sección.
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-3 text-center">Sel.</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Concepto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Pagado Por</th>
                <th className="p-3 text-center">Comprobante</th>
                <th className="p-3 text-right">Monto</th>
                <th className="p-3 text-center">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {listaGastos.map((gasto) => {
                const fechaFormateada = formatearFechaLarga(gasto.fechaGasto);
                const estaSeleccionado = registrosSeleccionados.includes(gasto.id);

                return (
                  <tr key={gasto.id} className={`transition-colors ${estaSeleccionado ? "bg-blue-50/70" : "hover:bg-gray-50"}`}>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={estaSeleccionado}
                        onChange={() => handleToggleSeleccion(gasto.id)}
                        className="w-4 h-4 text-blue-500 rounded cursor-pointer accent-blue-500"
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap text-gray-600">
                      <span className="font-semibold text-gray-800">{fechaFormateada.corto}</span>
                      <p className="text-xs text-gray-500 capitalize">{fechaFormateada.diaSemana}</p>
                    </td>
                    <td className="p-3 font-medium text-gray-900">
                      {gasto.concepto}
                      {gasto.notas && <p className="text-xs text-gray-500 font-normal">{gasto.notas}</p>}
                    </td>
                    <td className="p-3 text-gray-600">
                      {nombresCategorias[gasto.categoriaId] || gasto.categoriaId}
                    </td>
                    <td className="p-3 text-gray-600 font-medium">{gasto.pagadoPor}</td>
                    <td className="p-3 text-center">
                      {gasto.comprobanteUrl ? (
                        <a
                          href={gasto.comprobanteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
                        >
                          📎 Ver foto
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Sin foto</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-bold text-gray-800">
                      ${Number(gasto.monto).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <select
                        value={gasto.estatus || "pagado"}
                        onChange={(e) => handleCambioEstatus(gasto.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                          gasto.estatus === "presupuesto"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        <option value="pagado">Pagado</option>
                        <option value="presupuesto">Presupuesto</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Tarjetas de Subtotales por Categoría */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Object.keys(nombresCategorias).map((catKey) => {
          const totalCat = subtotalesPagados[catKey] || 0;
          return (
            <div key={catKey} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-xs font-medium text-gray-500 truncate">{nombresCategorias[catKey]}</p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                ${totalCat.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabla Gastos Pagados */}
      {renderTabla(gastosPagados, "Gastos Pagados", "bg-emerald-100", "text-emerald-800")}

      {/* Botón Fijo para Borrar Seleccionados (ubicado después de Gastos Pagados) */}
      <div className="flex justify-end -mt-2 mb-6">
        <button
          onClick={handleBorrarSeleccionados}
          disabled={registrosSeleccionados.length === 0}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5"
        >
          <span>🗑️ Borrar ({registrosSeleccionados.length})</span>
        </button>
      </div>

      {/* Tabla Gastos Presupuestados */}
      {renderTabla(gastosPresupuesto, "Gastos Presupuestados", "bg-amber-100", "text-amber-800")}

      {/* Sección Información Anexa */}
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            {/* Ícono vectorial de carpeta principal en azul baby */}
            <svg className="w-7 h-7 text-blue-300 fill-current" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Información Anexa</h3>
              <p className="text-xs text-gray-500">Haz clic en cualquier carpeta para acceder al almacenamiento en Google Drive</p>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Carpeta 03 */}
          <a
            href={enlacesDrive.estudios}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md active:scale-95 transition-all duration-300 flex items-start gap-3 group cursor-pointer"
          >
            <svg className="w-8 h-8 text-blue-300 fill-current group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                03_Estudios y Laboratorios
              </p>
              <p className="text-xs text-gray-500 mt-1">Análisis, imágenes y resultados ↗</p>
            </div>
          </a>

          {/* Carpeta 04 */}
          <a
            href={enlacesDrive.medicamentos}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md active:scale-95 transition-all duration-300 flex items-start gap-3 group cursor-pointer"
          >
            <svg className="w-8 h-8 text-blue-300 fill-current group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                04_Fotos de Medicamentos
              </p>
              <p className="text-xs text-gray-500 mt-1">Empaques, tickets y recetas ↗</p>
            </div>
          </a>

          {/* Carpeta 05 */}
          <a
            href={enlacesDrive.lesion}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md active:scale-95 transition-all duration-300 flex items-start gap-3 group cursor-pointer"
          >
            <svg className="w-8 h-8 text-blue-300 fill-current group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                05_Fotos evolución de la lesión
              </p>
              <p className="text-xs text-gray-500 mt-1">Registro fotográfico y avance ↗</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}