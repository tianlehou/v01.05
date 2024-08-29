import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";
import { initializeSearch } from "../modules/searchFunction.js";
import { initScrollButtons } from "../modules/scrollButtons.js";
import { updatePagination, currentPage, itemsPerPage } from "../modules/pagination.js";
import { updateAttendanceCounter } from "../modules/tabla/attendanceCounter.js";
import "../modules/downloadToExcel.js";
import "../auth/signup_Form.js";

// Constantes y variables de estado
const tabla = document.getElementById("libreria");
let totalPages;

// Función para mostrar los datos en la tabla
export function mostrarDatos() {
  onValue(ref(database, collection), (snapshot) => {
    tabla.innerHTML = ""; // Limpia la tabla

    const data = [];
    snapshot.forEach((childSnapshot) => {
      data.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    data.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordena por nombre

    // Paginación
    totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);
    let filaNumero = startIndex + 1;

    // Mostrar datos de la página actual
    for (let i = startIndex; i < endIndex; i++) {
      const user = data[i];
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="text-center">${filaNumero++}</td>
        <td class="text-center">${user.nombre}</td>
        <td class="text-center attendance-cell"></td>
        <td class="text-center"><span class="${!user.lunes ? 'invisible-value' : ''}" data-field="lunes">${user.lunes || ''}</span></td>
        <td class="text-center"><span class="${!user.martes ? 'invisible-value' : ''}" data-field="martes">${user.martes || ''}</span></td>
        <td class="text-center"><span class="${!user.miercoles ? 'invisible-value' : ''}" data-field="miercoles">${user.miercoles || ''}</span></td>
        <td class="text-center"><span class="${!user.jueves ? 'invisible-value' : ''}" data-field="jueves">${user.jueves || ''}</span></td>
        <td class="text-center"><span class="${!user.viernes ? 'invisible-value' : ''}" data-field="viernes">${user.viernes || ''}</span></td>
        <td class="text-center"><span class="${!user.sabado ? 'invisible-value' : ''}" data-field="sabado">${user.sabado || ''}</span></td>
      `;
      tabla.appendChild(row);

      // Actualiza el contador de asistencia para cada fila
      updateAttendanceCounter(row);
    }

    // Configuración inicial del estilo basado en el valor de los spans
    const spans = tabla.querySelectorAll("span");

    spans.forEach((span) => {
      const textContent = span.textContent.trim();
      if (textContent === "12.00" || textContent === "Completo") {
        span.style.color = "green";
        span.style.fontWeight = "bold";
      }
    });

    updatePagination(totalPages, mostrarDatos);
  });
}



// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  mostrarDatos();
  initializeSearch(tabla);
  initScrollButtons(tabla);

});

console.log(database);