import { push, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";


// Selecciona el formulario por su ID o clase
const form = document.getElementById("registerForm"); // Reemplaza "registerForm" con el ID real de tu formulario

// Inicializa isSubmitting para controlar el estado del envío
let isSubmitting = false;

// Verifica si el formulario fue correctamente seleccionado
if (form) {
    // Evento para enviar el formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que se recargue la página al enviar el formulario

        console.log("Evento submit está funcionando"); // Agregar este console.log

        if (!isSubmitting) {
            isSubmitting = true; // Bloquea el formulario para evitar múltiples envíos

            const nombreInput = document.getElementById("validationNombre").value;

            // Verifica que los campos no estén vacíos
            if (nombreInput.trim() !== "") {

                // Crear un nuevo objeto con los datos a guardar
                const nuevoRegistro = {
                    nombre: nombreInput,
                };

                // Obtener una referencia a la ubicación en la base de datos donde se guardarán los datos
                const referenciaUnidades = ref(database, collection);

                // Agregar datos a la base de datos
                push(referenciaUnidades, nuevoRegistro)
                    .then(() => {
                        // Limpia los campos del formulario
                        form.reset();
                        // Desbloquea el formulario después de 1 segundo
                        setTimeout(() => {
                            isSubmitting = false;
                        }, 1000);
                        // Recarga la página después de enviar el formulario
                        setTimeout(() => {
                            location.reload();
                        }, 100);
                    })
                    .catch((error) => {
                        console.error("Error al enviar datos a la base de datos:", error);
                        // Desbloquea el formulario en caso de error
                        isSubmitting = false;
                    });
            } else {
                alert("Por favor completa todos los campos.");
                isSubmitting = false; // Desbloquea el formulario si la validación falla
            }
        } else {
            alert(
                "Ya se está enviando un formulario. Por favor espera unos momentos antes de intentar de nuevo."
            );
        }
    });
} else {
    console.error("El formulario no fue encontrado.");
}
