import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";
import { mostrarModal } from "../modules/mostrarModal.js";
import { initializeSearch } from "../modules/searchFunction.js";
import { initScrollButtons } from "../modules/scrollButtons.js";
import { updatePagination, currentPage, itemsPerPage } from "../modules/pagination.js";
import { changeSemanaSelect } from "../modules/tabla/changeSelectEvent.js";
import { toggleTableVisibility } from "../modules/tabla/toggleTableVisibility.js";
import { addEditEventListeners } from "../modules/tabla/editRow.js";
import { deleteRow } from "../modules/tabla/deleteRow.js";
import { updateAttendanceCounter } from "../modules/tabla/attendanceCounter.js";
import "../modules/downloadToExcel.js";
import "../modules/newRegister.js";

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

                <!-- Aquí se mostrará el contador -->
                <td class="text-center attendance-cell"></td>

                ${["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].map((dia) => `
                    <td class="text-center">
                        <div class="flex-container">
                            <span class="${!user[dia] ? 'invisible-value' : ''}">${user[dia] || ''}</span>
                            <select class="form-select pay-select" data-id="${user.id}" data-field="${dia}">
                                <option value="" ${user[dia] === "" ? "selected" : ""}></option>
                                <option value="---" ${user[dia] === "---" ? "selected" : "---"}></option>
                                <option value="12.00" ${user[dia] === "12.00" ? "selected" : ""}>12.00</option>
                            </select>
                        </div>
                    </td>
                `).join('')}

                <td class="display-flex-center">
                    <button class="btn btn-primary mg-05em edit-user-button" data-id="${user.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            `;
            tabla.appendChild(row);

            // Actualizar contador de asistencia para cada fila
            updateAttendanceCounter(row);
        }

        const selectElements = document.querySelectorAll("select");

        selectElements.forEach((selectElement) => {
            selectElement.addEventListener("change", function () {
                const selectedValue = this.value;
                const userId = this.getAttribute("data-id");
                const field = this.getAttribute("data-field");

                if (["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].includes(field)) {
                    if (!confirm("¿Estás seguro de que deseas hacer este cambio?")) {
                        this.value = this.dataset.oldValue;
                        return;
                    }
                }

                update(ref(database, `${collection}/${userId}`), {
                    [field]: selectedValue,
                });

            });

            const selectedValue = selectElement.value;
            selectElement.dataset.oldValue = selectedValue;
            selectElement.disabled = selectedValue === "12.00";
            if (selectedValue === "12.00" || selectedValue === "Completado") {
                selectElement.closest('div.flex-container').querySelector('span').style.color = "green";
                selectElement.closest('div.flex-container').querySelector('span').style.fontWeight = "bold";
            }
        });

        deleteRow(database, collection);
        updatePagination(totalPages, mostrarDatos);
        addEditEventListeners(database, collection);
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#showModalButton').addEventListener('click', mostrarModal);
    mostrarDatos();
    initializeSearch(tabla);
    initScrollButtons(tabla);
    changeSemanaSelect(tabla, database, collection);
    toggleTableVisibility();
});

console.log(database);
