import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../environment/firebaseConfig.js";

// Función para cargar un archivo Excel
async function loadExcelTemplate(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    return workbook;
}

// Función para descargar datos y convertirlos en Excel usando una plantilla
async function downloadToExcel() {
    const confirmDownload = confirm("¿Estás seguro de que deseas descargar el archivo Excel?");
    
    if (confirmDownload) {
        const templateWorkbook = await loadExcelTemplate("../assets/excelTemplate/datos-pages-02.xlsx");

        // Obtén los datos de la base de datos Firebase una sola vez
        const snapshot = await get(ref(database, collection));
        const data = [];
        snapshot.forEach((childSnapshot) => {
            const { nombre } = childSnapshot.val();

            // Extraer explícitamente cada día
            const row = {
                nombre,
                dia1: childSnapshot.val()["1"] || "",
                dia2: childSnapshot.val()["2"] || "",
                dia3: childSnapshot.val()["3"] || "",
                dia4: childSnapshot.val()["4"] || "",
                dia5: childSnapshot.val()["5"] || "",
                dia6: childSnapshot.val()["6"] || "",
                dia7: childSnapshot.val()["7"] || "",
                dia8: childSnapshot.val()["8"] || "",
                dia9: childSnapshot.val()["9"] || "",
                dia10: childSnapshot.val()["10"] || "",
                dia11: childSnapshot.val()["11"] || "",
                dia12: childSnapshot.val()["12"] || "",
                dia13: childSnapshot.val()["13"] || "",
                dia14: childSnapshot.val()["14"] || "",
                dia15: childSnapshot.val()["15"] || "",
                dia16: childSnapshot.val()["16"] || "",
                dia17: childSnapshot.val()["17"] || "",
                dia18: childSnapshot.val()["18"] || "",
                dia19: childSnapshot.val()["19"] || "",
                dia20: childSnapshot.val()["20"] || "",
                dia21: childSnapshot.val()["21"] || "",
                dia22: childSnapshot.val()["22"] || "",
                dia23: childSnapshot.val()["23"] || "",
                dia24: childSnapshot.val()["24"] || "",
                dia25: childSnapshot.val()["25"] || "",
                dia26: childSnapshot.val()["26"] || "",
                dia27: childSnapshot.val()["27"] || "",
                dia28: childSnapshot.val()["28"] || "",
                dia29: childSnapshot.val()["29"] || "",
                dia30: childSnapshot.val()["30"] || "",
                dia31: childSnapshot.val()["31"] || ""
            };
            data.push(row);
        });

        const worksheet = templateWorkbook.Sheets[templateWorkbook.SheetNames[0]];
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        let startRow = range.e.r + 1;

        data.forEach((row, index) => {
            const rowNum = startRow + index;
            const cellValues = Object.values(row);
            cellValues.forEach((value, colIndex) => {
                const cellAddress = { c: colIndex, r: rowNum };
                const cellRef = XLSX.utils.encode_cell(cellAddress);

                const headerCellAddress = { c: colIndex, r: 1 };
                const headerCellRef = XLSX.utils.encode_cell(headerCellAddress);
                const headerCell = worksheet[headerCellRef];

                // Verificar si headerCell existe y tiene un estilo 's'
                const style = headerCell && headerCell.s ? headerCell.s : {};

                worksheet[cellRef] = { v: value, s: style };
            });
        });

        worksheet['!ref'] = XLSX.utils.encode_range(range.s, { c: range.e.c, r: startRow + data.length - 1 });
        XLSX.writeFile(templateWorkbook, "datos-pages-02.xlsx");
        alert("Se ha descargado un excel con los datos del tablero", "success");
    } else {
        alert("Descarga cancelada");
    }
}

// Asigna la función downloadToExcel al evento click del botón
document.getElementById("downloadToExcel-pages-02").addEventListener("click", downloadToExcel);
