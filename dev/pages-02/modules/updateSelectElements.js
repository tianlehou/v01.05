import { ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Función para obtener la fecha y hora en la zona horaria de Panamá.
function getPanamaDateTime() {
    const panamaOffset = -4;
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const panamaDate = new Date(utc + (3600000 * panamaOffset));
    
    // Formatear manualmente para obtener DD/MM/AA
    const day = String(panamaDate.getDate()).padStart(2, '0');
    const month = String(panamaDate.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = String(panamaDate.getFullYear()).slice(-2); // Obtener solo los dos últimos dígitos del año
    const hours = String(panamaDate.getHours()).padStart(2, '0');
    const minutes = String(panamaDate.getMinutes()).padStart(2, '0');
    const seconds = String(panamaDate.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Función para aplicar estilos según el valor de Cobro
function applyStyles(cobroElement, selectedValue) {
    if (selectedValue === "6.00" || selectedValue === "10.00" || selectedValue === "11.00" || selectedValue === "24.00") {
        cobroElement.style.color = "var(--secondary-color)";
        cobroElement.style.fontWeight = "bold";
    } else if (selectedValue === "No Pagó") {
        cobroElement.style.color = "var(--accent-color)";
    }
}

// Función para actualizar visualmente el select y la celda correspondiente
function updateCellAppearance(selectElement, selectedValue, timestamp) {
    const tdElement = selectElement.closest('td');

    // Asegúrate de que la celda contenga un contenedor donde puedas mostrar los valores
    let displayElement = tdElement.querySelector('.display-values');
    if (!displayElement) {
        // Si no existe, crea un contenedor para los valores
        displayElement = document.createElement('div');
        displayElement.classList.add('display-values');
        tdElement.appendChild(displayElement);
    }

    // Mostrar el valor seleccionado de Cobro y el timestamp en el contenedor
    displayElement.innerHTML = `
        <span class="cobro-value">${selectedValue}</span><br>
    `;

    // Aplicar estilos según el valor de Cobro
    applyStyles(displayElement.querySelector('.cobro-value'), selectedValue);
}

// Función principal que maneja los eventos y actualiza el select correspondiente
export function updateSelectElements(database, collection) {
    const selectElements = document.querySelectorAll(".pay-select");

    selectElements.forEach((selectElement) => {
        // Guardar el valor original del select
        const originalValue = selectElement.value;

        // Asegurar que solo un select tenga un manejador de evento
        selectElement.removeEventListener("change", handleSelectChange); // Eliminar cualquier evento previo
        selectElement.addEventListener("change", handleSelectChange);

        // Función para actualizar en Firebase y la visualización
        function handleSelectChange(event) {
            const selectedValue = event.target.value;
            const userId = event.target.getAttribute("data-id");
            const field = event.target.getAttribute("data-field");
            const timestamp = getPanamaDateTime(); // Obtener el timestamp actual

            // Verificar que el userId esté definido
            if (!userId) {
                console.error("El atributo 'data-id' no está definido en el select", event.target);
                return;
            }

            const updateData = {
                [field]: {
                    Cobro: selectedValue,
                    timestamp: timestamp
                }
            };

            update(ref(database, `${collection}/${userId}`), updateData)
                .then(() => {
                    updateCellAppearance(event.target, selectedValue, timestamp);

                    // Si el valor es 11.00 o 24.00, eliminar el select
                    if (selectedValue === "6.00" || selectedValue === "10.00" || selectedValue === "11.00" || selectedValue === "24.00") {
                        event.target.remove();  // Elimina el select después de actualizar
                    }
                })
                .catch((error) => {
                    console.error("Error al actualizar en Firebase: ", error);
                    event.target.value = originalValue; // Restaurar el valor si hay un error
                });
        }

        // Aplicar los estilos iniciales basados en el valor actual del select
        updateCellAppearance(selectElement, selectElement.value, selectElement.closest('td').querySelector('.timestamp')?.textContent || '');
    });
}
