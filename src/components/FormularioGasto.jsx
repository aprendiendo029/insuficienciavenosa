import { useState } from "react";

export default function FormularioGasto({ onGastoAgregado, guardando }) {
  const [formData, setFormData] = useState({
    concepto: "",
    monto: "",
    categoriaId: "consultas",
    fechaGasto: new Date().toISOString().split("T")[0],
    pagadoPor: "",
    metodoPago: "efectivo",
    estatus: "pagado",
    comprobanteUrl: "",
    notas: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.monto || !formData.concepto || !formData.pagadoPor) {
      alert("Por favor completa los campos obligatorios (*).");
      return;
    }

    onGastoAgregado(formData);

    setFormData({
      concepto: "",
      monto: "",
      categoriaId: "consultas",
      fechaGasto: new Date().toISOString().split("T")[0],
      pagadoPor: formData.pagadoPor,
      metodoPago: "efectivo",
      estatus: "pagado",
      comprobanteUrl: "",
      notas: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Registrar Nuevo Gasto</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Concepto / Descripción *</label>
          <input
            type="text"
            name="concepto"
            value={formData.concepto}
            onChange={handleChange}
            placeholder="Ej. Consulta Médica General"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto ($ MXN) *</label>
          <input
            type="number"
            step="0.01"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="consultas">Consultas y Honorarios</option>
            <option value="medicamentos">Medicamentos y Farmacia</option>
            <option value="estudios">Estudios y Laboratorio</option>
            <option value="transporte">Transporte y Traslados</option>
            <option value="varios">Otros / Varios</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha del Gasto *</label>
          <input
            type="date"
            name="fechaGasto"
            value={formData.fechaGasto}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pagado Por (Nombre) *</label>
          <input
            type="text"
            name="pagadoPor"
            value={formData.pagadoPor}
            onChange={handleChange}
            placeholder="Ej. Laura / Carlos"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estatus Inicial</label>
          <select
            name="estatus"
            value={formData.estatus}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="pagado">Pagado</option>
            <option value="presupuesto">Presupuesto</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Link / URL del Comprobante (Google Drive, Dropbox, etc.)
          </label>
          <input
            type="url"
            name="comprobanteUrl"
            value={formData.comprobanteUrl}
            onChange={handleChange}
            placeholder="https://drive.google.com/file/d/..."
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notas / Detalles</label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            rows="1"
            placeholder="Ej. Comprado en Farmacias del Ahorro"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>
      </div>

      {/* Contenedor alineado a la derecha con el botón reducido en tamaño */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={guardando}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:bg-blue-200 text-sm shadow-sm"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}