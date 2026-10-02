import { db } from "../firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";

const COLECCION_GASTOS = "gastos";

// Guardar gasto en Firestore
export const guardarGasto = async (datosGasto) => {
  try {
    const docRef = await addDoc(collection(db, COLECCION_GASTOS), {
      ...datosGasto,
      monto: Number(datosGasto.monto),
      estatus: datosGasto.estatus || "pagado",
      pagadoPor: datosGasto.pagadoPor,
      comprobanteUrl: datosGasto.comprobanteUrl || "",
      fechaGasto: Timestamp.fromDate(new Date(datosGasto.fechaGasto + "T00:00:00")),
      fechaRegistro: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar el gasto:", error);
    throw error;
  }
};

// Actualizar gasto
export const actualizarGasto = async (id, datosGasto) => {
  try {
    const gastoRef = doc(db, COLECCION_GASTOS, id);
    await updateDoc(gastoRef, datosGasto);
  } catch (error) {
    console.error("Error al actualizar el gasto:", error);
    throw error;
  }
};

// Actualizar estatus del gasto (pagado / presupuesto)
export const actualizarEstatusGasto = async (id, nuevoEstatus) => {
  try {
    const gastoRef = doc(db, COLECCION_GASTOS, id);
    await updateDoc(gastoRef, {
      estatus: nuevoEstatus
    });
  } catch (error) {
    console.error("Error al actualizar el estatus:", error);
    throw error;
  }
};

// Eliminar gasto (Punto #3)
export const eliminarGasto = async (id) => {
  try {
    const gastoRef = doc(db, COLECCION_GASTOS, id);
    await deleteDoc(gastoRef);
  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
    throw error;
  }
};

// Obtener lista completa de gastos
export const obtenerGastos = async () => {
  try {
    const q = query(collection(db, COLECCION_GASTOS), orderBy("fechaGasto", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        ...data,
        estatus: data.estatus || "pagado",
        pagadoPor: data.pagadoPor || data.registradoPor || "No especificado",
        fechaGasto: data.fechaGasto?.toDate().toISOString().split("T")[0] || ""
      };
    });
  } catch (error) {
    console.error("Error al obtener los gastos:", error);
    throw error;
  }
};