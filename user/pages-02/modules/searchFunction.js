import { database } from "../../environment/firebaseConfig.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { addEditEventListeners } from './editRow.js'; // Importa la función para añadir event listeners a los botones de editar
import { deleteRow } from './deleteRow.js'; // Importa la función para añadir event listeners a los botones de borrar
import { updateSpanElements } from "./updateSpanElements.js";

// Función para buscar y filtrar los datos
export function findAndSearch(tabla) {
  const input = document.getElementById("searchInput").value.toLowerCase();

  // Obtén los datos desde Firebase
  onValue(ref(database, collection), (snapshot) => {
    const data = [];
    snapshot.forEach((childSnapshot) => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      data.push(user);
    });

    // Filtrar los datos
    const filteredData = data.filter(user => {
      return Object.values(user).some(value => value.toString().toLowerCase().includes(input));
    });

    // Renderiza los datos filtrados
    renderUsersTable(filteredData);
  });
}

// Función para renderizar los datos en la tabla
function renderUsersTable(data) {
  const tabla = document.getElementById("miTabla");
  tabla.innerHTML = "";

  data.forEach((user, index) => {
    const row = `
      <tr>
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center" id="headerTabla">Unidad</th>
            <th class="text-center">1</th>
            <th class="text-center">2</th>
            <th class="text-center">3</th>
            <th class="text-center">4</th>
            <th class="text-center">5</th>
            <th class="text-center">6</th>
            <th class="text-center">7</th>
            <th class="text-center">8</th>
            <th class="text-center">9</th>
            <th class="text-center">10</th>
            <th class="text-center">11</th>
            <th class="text-center">12</th>
            <th class="text-center">13</th>
            <th class="text-center">14</th>
            <th class="text-center">15</th>
            <th class="text-center">16</th>
            <th class="text-center">17</th>
            <th class="text-center">18</th>
            <th class="text-center">19</th>
            <th class="text-center">20</th>
            <th class="text-center">21</th>
            <th class="text-center">22</th>
            <th class="text-center">23</th>
            <th class="text-center">24</th>
            <th class="text-center">25</th>
            <th class="text-center">26</th>
            <th class="text-center">27</th>
            <th class="text-center">28</th>
            <th class="text-center">29</th>
            <th class="text-center">30</th>
            <th class="text-center">31</th>
          </tr>
        </thead>

        <td class="text-center">${index + 1}</td>
        <td class="text-center">${user.nombre}</td>

        ${["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"].map((dia) => `
          <td class="${["12.00", "pagado"].includes(user[dia]) ? 'text-center' : ''}">
            <span class="${!user[dia] ? 'invisible-value' : ''}">${user[dia] || ''}</span>
          </td>
        `).join('')}

      </tr>
    `;
    tabla.innerHTML += row;
  });

  // Añadir el manejador de eventos a los selects
  attachSelectChangeListeners();
}

// Función para adjuntar manejadores de eventos a los selects
function attachSelectChangeListeners() {
  document.querySelectorAll('.form-select').forEach(select => {
    select.addEventListener('change', (event) => {
      const selectElement = event.target;
      const newValue = selectElement.value;
      const id = selectElement.getAttribute('data-id');
      const field = selectElement.getAttribute('data-field');

      // Actualiza los datos en Firebase
      update(ref(database, `${collection}/${id}`), {
        [field]: newValue
      }).then(() => {
        console.log('Datos actualizados exitosamente');
      }).catch(error => {
        console.error('Error al actualizar los datos: ', error);
      });
    });
  });

  // Añadir el manejador de eventos para los botones de editar y borrar
  addEditEventListeners();
  deleteRow(database, collection);
  updateSpanElements(database, collection);
}

// Función para inicializar la búsqueda
export function initializeSearch(tabla) {
  document.getElementById("searchButton").addEventListener("click", () => findAndSearch(tabla));

  document.getElementById("searchInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      findAndSearch(tabla);
    }
  });
}
