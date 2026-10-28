import { db } from "../firebase/config";
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";

const COLECCION_APORTACIONES = "aportaciones";

export const guardarAportacion = async (datosAportacion) => {
  try {
    const docRef = await addDoc(collection(db, COLECCION_APORTACIONES), {
      ...datosAportacion,
      monto: Number(datosAportacion.monto),
      fechaAportacion: Timestamp.fromDate(new Date(datosAportacion.fechaAportacion + "T00:00:00")),
      fechaRegistro: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la aportación:", error);
    throw error;
  }
};

export const eliminarAportacion = async (id) => {
  try {
    const docRef = doc(db, COLECCION_APORTACIONES, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar la aportación:", error);
    throw error;
  }
};

export const obtenerAportaciones = async () => {
  try {
    const q = query(collection(db, COLECCION_APORTACIONES), orderBy("fechaAportacion", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        ...data,
        fechaAportacion: data.fechaAportacion?.toDate().toISOString().split("T")[0] || ""
      };
    });
  } catch (error) {
    console.error("Error al obtener las aportaciones:", error);
    throw error;
  }
};