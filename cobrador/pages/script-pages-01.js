import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";
import { checkAuth } from '../auth/authCheck.js';
import "../auth/signup_Form.js";

import { addEditEventListeners } from "./modules/editRow.js";
import { deleteRow } from "../modules/tabla/deleteRow.js";
import "../modules/downloadToExcel.js";

import { includeHTML } from '../components/includeHTML/includeHTML.js';
import { changeEstadoSelectEvent } from "../modules/tabla/changeSelectEvent.js";
import { initializeSearch } from "../modules/searchFunction.js";

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");

export function mostrarDatos() {
    onValue(ref(database, collection), (snapshot) => {
        tabla.innerHTML = "";

        const data = [];
        snapshot.forEach((childSnapshot) => {
            data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        let filaNumero = 1;

        for (let i = 0; i < data.length; i++) {
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
                    <option value="Sin carro" ${user.estado === "Sin carro" ? "selected" : ""}>Sin carro</option>
                    <option value="Suspendido" ${user.estado === "Suspendido" ? "selected" : ""}>Suspendido</option>
                    <option value="Expulsado" ${user.estado === "Expulsado" ? "selected" : ""}>Expulsado</option>
                  </select>
                </div>
              </td>
              <td class="text-center role-col">
                <div class="text-center">
                  <span>${user.role}</span>
                </div>
              </td>
              <td>
                <button class="btn btn-primary edit-user-button" data-id="${user.id}"><i class="bi bi-highlighter"></i></button>
              </td>
              <td class="text-center">${user.email}</td>
              <td class="text-center">${user.userId}</td>
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

                update(ref(database, `${collection}/${userId}`), {
                    [field]: selectedValue,
                });
            });
        });

        deleteRow(database, collection);
        addEditEventListeners(database, collection);
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    mostrarDatos();
    initializeSearch(tabla);
    includeHTML();
    changeEstadoSelectEvent(tabla, database, collection);
});

console.log(database);
