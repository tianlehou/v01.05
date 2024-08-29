// modules/tabla/loadDefaultNames.js
import * as XLSX from "https://cdn.sheetjs.com/xlsx-latest/package/xlsx.mjs";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../environment/firebaseConfig.js";

export async function cargarListaPredeterminada(tabla) {
    try {
        const response = await fetch('../assets/excelTemplate/nombres.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const nombres = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        nombres.shift(); // Elimina la primera fila si es el encabezado

        nombres.forEach((nombre, index) => {
            const fila = tabla.rows[index];
            if (fila && fila.cells[3]) {
                const userId = `user_${index + 1}`;
                update(ref(database, `collection/${userId}`), { nombre: nombre[0] });
                fila.cells[3].textContent = nombre[0]; // Asigna el nombre a la celda de la tabla
            } else {
                console.warn(`Fila o celda en la posición ${index} no encontrada. Asegúrate de que la tabla tenga suficientes filas.`);
            }
        });
    } catch (error) {
        console.error("Error al cargar la lista predeterminada:", error);
    }
}
