import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";

import { addEditEventListeners } from "./modules/editRow.js";
import { deleteRow } from "./modules/deleteRow.js";
import { toggleTableVisibility } from "../modules/tabla/toggleTableVisibility.js";

import { initializeSearch } from "./modules/searchFunction.js";
import { initScrollButtons } from "../modules/scrollButtons.js";
import { updatePagination, currentPage, itemsPerPage } from "../modules/pagination.js";
import { handleFileUpload } from '../modules/Excel/uploadExcelHandler.js';
import "./modules/newRegister.js";
import { includeHTML } from '../components/includeHTML/includeHTML.js';
import { updateSelectElements } from './modules/updateSelectElements.js';
import "./modules/downloadToExcel.js";
// Mostrar datos y generar las filas de la tabla
import { updateTotalSums } from './modules/sumColumns.js';
// Importar las funciones modularizadas
import { getDaysInMonth, getMonthAndYearFromURL, generateCalendarDays } from './modules/calendarUtils.js';

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");
let totalPages;

// Lee la variable collection desde el HTML
export const collection = (() => {
    const scriptTag = document.querySelector('script[data-collection]');
    if (scriptTag) {
        return scriptTag.getAttribute('data-collection');
    }
})();

if (!collection) {
    console.error('La variable collection está vacía.');
}

function getElementByIdSafe(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with ID '${id}' not found.`);
    }
    return element;
}

export function mostrarDatos() {
    const tabla = getElementByIdSafe("contenidoTabla");
    if (!tabla) {
        return; // Salir si no se encuentra el elemento
    }
    const { month, year } = getMonthAndYearFromURL();

    if (!collection) {
        console.error('La ruta de la colección es inválida.');
        return;
    }

    onValue(ref(database, collection), (snapshot) => {
        tabla.innerHTML = "";

        const data = [];
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            // Añadir el ID del snapshot a los datos
            data.push({ id: childSnapshot.key, ...user });
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
                ${generateCalendarDays(month, year, user)}
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
        }
        
        // Llama a la función modularizada
        addEditEventListeners(database, collection);
        deleteRow(database, collection);
        updatePagination(totalPages, mostrarDatos);
        updateSelectElements(database, collection); // Llama a la función para manejar los selectores y la actualización del timestamp

        // Llama a la función para actualizar los totales
        updateTotalSums(tabla, Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 2));
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    mostrarDatos();
    includeHTML();
    initializeSearch(tabla);
    initScrollButtons(tabla);
    toggleTableVisibility();
    handleFileUpload();
});

console.log(database);
