// script-pages-02.js
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";

import { addEditEventListeners } from "./modules/editRow.js";
import { changeSemanaSelect } from "../modules/tabla/changeSelectEvent.js";
import { deleteRow } from "./modules/deleteRow.js";
import { toggleTableVisibility } from "../modules/tabla/toggleTableVisibility.js";
import { updateAttendanceCounter } from "../modules/tabla/attendanceCounter.js";

import { initializeSearch } from "./modules/searchFunction.js";
import { initScrollButtons } from "../modules/scrollButtons.js";
import { updatePagination, currentPage, itemsPerPage } from "../modules/pagination.js";
import { handleFileUpload } from '../modules/Excel/uploadExcelHandler.js';
import "../modules/newRegister.js";
import { includeHTML } from '../components/includeHTML/includeHTML.js';
import { updateSelectElements } from '../modules/tabla/updateSelectElements.js'; // Importar el archivo modularizado
import "./modules/downloadToExcel.js";

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");
let totalPages;

export function mostrarDatos() {
    onValue(ref(database, collection), (snapshot) => {
        tabla.innerHTML = "";

        const data = [];
        snapshot.forEach((childSnapshot) => {
            data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);
        let filaNumero = startIndex + 1;

        for (let i = startIndex; i < endIndex; i++) {
            const user = data[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">${filaNumero++}</td>
                <td class="text-center">${user.nombre}</td>

                ${["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"].map((dia) => `
                    <td class="${["12.00", "pagado"].includes(user[dia]) ? 'text-center' : ''}">
                        <div class="flex-container">
                            <span class="${!user[dia] ? 'invisible-value' : ''}">${user[dia] || ''}</span>
                            <select class="form-select pay-select ${["12.00", "pagado"].includes(user[dia]) ? 'd-none' : ''}" data-id="${user.id}" data-field="${dia}">
                                <option value="" ${user[dia] === "" ? "selected" : ""}></option>
                                <option value="---" ${user[dia] === "---" ? "selected" : "---"}></option>
                                <option value="12.00" ${user[dia] === "12.00" ? "selected" : ""}>12.00</option>
                                <option value="pagado" ${user[dia] === "pagado" ? "selected" : ""}>pagado</option>
                            </select>
                        </div>
                    </td>
                `).join('')}

                <td class="display-flex-center">
                    <button class="btn btn-primary mg-05em edit-user-button" data-id="${user.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger mg-05em delete-user-button" data-id="${user.id}">
                        <i class="bi bi-eraser-fill"></i>
                    </button>
                </td>
                <td class="text-center">
                    <span class="${!user.userId ? 'invisible-value' : ''}">${user.userId || ''}</span>
                </td>
            `;
            tabla.appendChild(row);

            // Actualizar contador de asistencia para cada fila
            updateAttendanceCounter(row);
        }

        // Llama a la función modularizada
        addEditEventListeners(database, collection);
        deleteRow(database, collection);
        updatePagination(totalPages, mostrarDatos);
        updateSelectElements(database, collection);
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    mostrarDatos();
    includeHTML();
    initializeSearch(tabla);
    initScrollButtons(tabla);
    changeSemanaSelect(tabla, database, collection);
    toggleTableVisibility();
    handleFileUpload();
});

console.log(database);
