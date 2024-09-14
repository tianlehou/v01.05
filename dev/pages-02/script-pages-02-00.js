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
import { updateTotalSums } from './modules/sumColumns.js';
import { getDaysInMonth, getMonthAndYearFromURL, generateCalendarDays } from './modules/calendarUtils.js';

const tabla = document.getElementById("contenidoTabla");
let totalPages;

export const collection = (() => {
    const scriptTag = document.querySelector('script[data-collection]');
    if (scriptTag) {
        return scriptTag.getAttribute('data-collection');
    }
})();

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
        return;
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
            data.push({ id: childSnapshot.key, ...user });
        });

        data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        let filaNumero = 1;
        data.forEach((user) => {
            const row = document.createElement("tr");
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
        });

        // Asegúrate de que estos listeners sigan activos
        addEditEventListeners(database, collection);
        deleteRow(database, collection);
        updateSelectElements(database, collection);
        updatePagination(totalPages, mostrarDatos);
        updateTotalSums(tabla, Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 2));

        // Generar los botones para seleccionar días
        const dayButtonsContainer = document.getElementById("day-buttons-container");
        dayButtonsContainer.innerHTML = generateDayButtons(getDaysInMonth(month, year));

        // Inicializar la funcionalidad de selección de días
        initializeDaySelection();
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

function initializeDaySelection() {
  const botones = document.querySelectorAll(".day-button");
  
  botones.forEach(boton => {
    boton.addEventListener("click", function () {
      const diaSeleccionado = boton.getAttribute("data-day");

      // Mostrar solo las columnas correspondientes al día seleccionado
      mostrarColumnaSeleccionada(diaSeleccionado);

      // Remover clase 'active' de todos los botones y agregarla solo al seleccionado
      botones.forEach(btn => btn.classList.remove("active"));
      boton.classList.add("active");
    });
  });
}

function mostrarColumnaSeleccionada(diaSeleccionado) {
  const columnas = document.querySelectorAll(`th[data-day], td[data-day]`);

  // Ocultar todas las columnas
  columnas.forEach(columna => {
    columna.style.display = "none";
  });

  // Mostrar solo la columna correspondiente al día seleccionado
  document.querySelectorAll(`[data-day="${diaSeleccionado}"]`).forEach(columna => {
    columna.style.display = "";
  });
}

console.log(database);
