import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";

import "../auth/signup_Form.js";

import { addEditEventListeners } from "../modules/tabla/editRow.js";
import { deleteRow } from "../modules/tabla/deleteRow.js";
import "../modules/downloadToExcel.js";

import { includeHTML } from '../components/includeHTML/_includeHTML.js';
import { changeEstadoSelectEvent, changeRoleSelectEvent } from "../modules/tabla/changeSelectEvent.js";
import { initializeSearch } from "../modules/searchFunction.js";

import { initScrollButtons } from "../modules/scrollButtons.js";
import { updatePagination, currentPage, itemsPerPage } from "../modules/pagination.js";

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
            const row = `
            <tr>
              <td class="text-center">${filaNumero++}</td>
              <td class="text-center">${user.unidad}</td>
              <td class="text-center">${user.placa}</td>
              <td class="text-center">${user.nombre}</td>
              <td class="text-center">${user.cedula}</td>
              <td class="text-center">
                <a href="https://wa.me/${user.whatsapp}" target="_blank">
                  ${user.whatsapp}
                </a>
              </td>
              <td class="text-center estado-col">
                <div class="flex-container">
                  <span>${user.estado}</span>
                  <select class="form-select estado-select" data-id="${user.id}">
                    <option value="Ninguno" ${user.estado === "Ninguno" ? "selected" : ""}>Ninguno</option>
                    <option value="Activo" ${user.estado === "Activo" ? "selected" : ""}>Activo</option>
                    <option value="Suspendido" ${user.estado === "Suspendido" ? "selected" : ""}>Suspendido</option>
                    <option value="Expulsado" ${user.estado === "Expulsado" ? "selected" : ""}>Expulsado</option>
                    <option value="Sin carro" ${user.estado === "Sin carro" ? "selected" : ""}>Sin carro</option>
                  </select>
                </div>
              </td>
              <td class="text-center role-col">
                <div class="flex-container">
                  <span>${user.role}</span>
                  <select class="form-select role-select" data-id="${user.id}">
                    <option value="Ninguno" ${user.role === "Ninguno" ? "selected" : ""}>Ninguno</option>
                    <option value="Propietario" ${user.role === "Propietario" ? "selected" : ""}>Propietario</option>
                    <option value="Conductor" ${user.role === "Conductor" ? "selected" : ""}>Conductor</option>
                    <option value="Secretario" ${user.role === "Secretario" ? "selected" : ""}>Secretario</option>
                  </select>
                </div>
              </td>
              <td>
                <button class="btn btn-primary edit-user-button" data-id="${user.id}"><i class="bi bi-highlighter"></i></button>
                <button class="btn btn-danger delete-user-button" data-id="${user.id}"><i class="bi bi-eraser-fill"></i></button>
              </td>
              <td class="text-center">${user.email}</td>
            </tr>
          `;
          tabla.innerHTML += row;
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
    mostrarDatos();
    initializeSearch(tabla);
    initScrollButtons(tabla);
    includeHTML();
    changeRoleSelectEvent(tabla, database, collection);
    changeEstadoSelectEvent(tabla, database, collection);
});

console.log(database);
