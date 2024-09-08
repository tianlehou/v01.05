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
import { updateSelectElements } from './modules/updateSelectElements.js';
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
        
                ${Array.from({ length: 31 }, (_, i) => {
                    const dia = (i + 1).toString(); // Convertimos el índice a un número de día (de "1" a "31")
                    const cobroData = user[dia] || {}; // Asume que es un objeto { Cobro: ..., timestamp: ... }
                    const cobro = cobroData.Cobro || ''; // Accede al valor del cobro
                    const timestamp = cobroData.timestamp || ''; // Accede al timestamp
                    const isHidden = ["6.00", "10.00", "11.00", "24.00"].includes(cobro);
        
                    return `
                        <td class="${isHidden ? 'text-center' : ''}">
                            <div class="flex-container display-center">
                                <select class="form-select pay-select ${isHidden ? 'd-none' : ''}" data-id="${user.id}" data-field="${dia}">
                                    <option value="" ${cobro === "" ? "selected" : ""}></option>
                                    <option value="6.00" ${cobro === "6.00" ? "selected" : ""}>6.00</option>
                                    <option value="10.00" ${cobro === "10.00" ? "selected" : ""}>10.00</option>
                                    <option value="11.00" ${cobro === "11.00" ? "selected" : ""}>11.00</option>
                                    <option value="24.00" ${cobro === "24.00" ? "selected" : ""}>24.00</option>
                                    <option value="No Pagó" ${cobro === "No Pagó" ? "selected" : ""}>No Pagó</option>
                                </select>
                            <div class="timestamp">${timestamp.split(' ').join('<br>')}</div> 
                            </div>
                        </td>
                    `;
                }).join('')}
        
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
        updateSelectElements(database, collection); // Llama a la función para manejar los selectores y la actualización del timestamp
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
