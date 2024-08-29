import { ref, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";

// Función para leer y procesar el archivo Excel
export function uploadExcelData(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Asumiendo que el primer sheet es el que necesitamos
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Aquí puedes procesar el jsonData según sea necesario
        actualizarNombresEnTabla(jsonData);
    };

    reader.readAsArrayBuffer(file);
}

// Función para actualizar los nombres en la tabla
function actualizarNombresEnTabla(data) {
    const nombresRef = ref(database, collection); // Reemplaza con la ruta correcta en tu base de datos

    data.forEach((item, index) => {
        const nombre = item.nombre; // Asumiendo que la columna en el archivo Excel se llama 'nombre'

        // Crea un nuevo registro en Firebase para cada nombre
        const nuevoRegistro = {
            nombre: nombre,
            // Aquí puedes agregar otros campos si es necesario
            // por ejemplo, `fecha: new Date().toISOString()`
        };

        push(nombresRef, nuevoRegistro)
            .then(() => {
                console.log(`Nombre ${nombre} agregado exitosamente.`);
            })
            .catch((error) => {
                console.error(`Error al agregar el nombre ${nombre}: `, error);
            });
    });
}

