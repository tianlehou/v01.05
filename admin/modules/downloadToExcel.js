import { onValue, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";

// Función para cargar un archivo Excel
async function loadExcelTemplate(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    return workbook;
}

// Función para descargar datos y convertirlos en Excel usando una plantilla
async function downloadToExcel() {
    // Mostrar una confirmación antes de descargar el archivo
    const confirmDownload = confirm("¿Estás seguro de que deseas descargar el archivo Excel?");
  
    // Verificar si el usuario confirmó la descarga
    if (confirmDownload) {
        // Cargar la plantilla de Excel
        const templateWorkbook = await loadExcelTemplate("../assets/excelTemplate/datos.xlsx");

        // Obtén los datos de la base de datos Firebase
        onValue(ref(database, collection), (snapshot) => {
            const data = [];
            snapshot.forEach((childSnapshot) => {
                // Filtrar las columnas que deseas incluir en el archivo Excel
                const { nombre, lunes, martes, miercoles, jueves, viernes, sabado } = childSnapshot.val();
                data.push({ nombre, lunes, martes, miercoles, jueves, viernes, sabado });
            });

            // Selecciona la hoja de la plantilla donde deseas insertar los datos
            const worksheet = templateWorkbook.Sheets[templateWorkbook.SheetNames[0]];

            // Inserta los datos en la hoja comenzando desde la fila 2
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            let startRow = range.e.r + 1;

            data.forEach((row, index) => {
                const rowNum = startRow + index;
                const cellValues = Object.values(row);
                cellValues.forEach((value, colIndex) => {
                    const cellAddress = { c: colIndex, r: rowNum };
                    const cellRef = XLSX.utils.encode_cell(cellAddress);

                    // Copia el estilo de la celda de encabezado a las nuevas celdas
                    const headerCellAddress = { c: colIndex, r: 1 }; // Fila de encabezado es la fila 1
                    const headerCellRef = XLSX.utils.encode_cell(headerCellAddress);
                    const headerCell = worksheet[headerCellRef];

                    worksheet[cellRef] = { v: value, s: headerCell.s };
                });
            });

            // Actualiza el rango de la hoja
            worksheet['!ref'] = XLSX.utils.encode_range(range.s, { c: range.e.c, r: startRow + data.length - 1 });

            // Crea un archivo Excel y lo descarga
            XLSX.writeFile(templateWorkbook, "datos.xlsx");
            // Muestra el mensaje de éxito después de completar la descarga
            alert("Se ha descargado un excel con los datos del tablero", "success");
        });
    } else {
        // El usuario canceló la descarga, no hacer nada
        alert("Descarga cancelada");
    }
}

// Asigna la función downloadToExcel al evento click del botón
document.getElementById("downloadToExcel").addEventListener("click", downloadToExcel);
