import { ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Función para obtener la fecha y hora en la zona horaria de Panamá.
function getPanamaDateTime() {
    const panamaOffset = -5;
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const panamaDate = new Date(utc + (3600000 * panamaOffset));

    const day = String(panamaDate.getDate()).padStart(2, '0');
    const month = String(panamaDate.getMonth() + 1).padStart(2, '0');
    const year = String(panamaDate.getFullYear()).slice(-2);
    const hours = String(panamaDate.getHours()).padStart(2, '0');
    const minutes = String(panamaDate.getMinutes()).padStart(2, '0');
    const seconds = String(panamaDate.getSeconds()).padStart(2, '0');

    return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}:${seconds}`
    };
}

// Función principal que maneja los eventos y actualiza el select correspondiente
export function updateSelectElements(database, collection) {
    const selectElements = document.querySelectorAll(".pay-select");

    selectElements.forEach((selectElement) => {
        const originalValue = selectElement.value;

        selectElement.removeEventListener("change", handleSelectChange); // Eliminar eventos previos
        selectElement.addEventListener("change", handleSelectChange);

        // Función que muestra el modal de confirmación
        function showConfirmationModal(callback) {
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'), {
                keyboard: false
            });
            
            const confirmButton = document.getElementById('confirmActionButton');
            const cancelButton = document.querySelector('.modal-footer .btn-secondary');

            // Mostrar el modal
            confirmationModal.show();

            // Confirmar acción
            confirmButton.onclick = function () {
                confirmationModal.hide();
                callback(true); // Acción confirmada
            };

            // Cancelar acción
            cancelButton.onclick = function () {
                confirmationModal.hide();
                callback(false); // Acción cancelada
            };
        }

        function handleSelectChange(event) {
            const selectedValue = event.target.value;
            const userId = event.target.getAttribute("data-id");
            const field = event.target.getAttribute("data-field");

            if (!userId) {
                console.error("El atributo 'data-id' no está definido en el select", event.target);
                return;
            }

            showConfirmationModal((isConfirmed) => {
                if (isConfirmed) {
                    const timestamp = getPanamaDateTime(); // Obtener fecha y hora actuales

                    // Formato para enviar a Firebase
                    const updateData = {
                        [field]: {
                            Cobro: selectedValue,
                            timestamp: `${timestamp.date} ${timestamp.time}`
                        }
                    };

                    update(ref(database, `${collection}/${userId}`), updateData)
                        .then(() => {
                            // Actualizar la vista visual con la fecha y hora en dos líneas
                            updateCellAppearance(event.target, selectedValue, timestamp);

                            // Si el valor es uno de los especificados, eliminar el select
                            const removableValues = ["6.00", "10.00", "11.00", "24.00"];
                            if (removableValues.includes(selectedValue)) {
                                event.target.remove();  // Elimina el select después de actualizar
                            }
                        })
                        .catch((error) => {
                            console.error("Error al actualizar en Firebase: ", error);
                            event.target.value = originalValue; // Restaurar valor en caso de error
                        });
                } else {
                    // Restaurar el valor original si la acción fue cancelada
                    event.target.value = originalValue;
                }
            });
        }

        // Aplicar los estilos iniciales basados en el valor actual del select
        const timestamp = getPanamaDateTime();
        updateCellAppearance(selectElement, selectElement.value, timestamp);
    });
}

// Función para aplicar estilos según el valor de Cobro
function applyStyles(cobroElement, selectedValue) {
    if (["6.00", "10.00", "11.00", "24.00"].includes(selectedValue)) {
        cobroElement.style.color = "var(--primary-color)";
        cobroElement.style.fontWeight = "500";
        cobroElement.style.fontSize = "1.33em";
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
