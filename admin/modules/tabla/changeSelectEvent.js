// Importa las funciones "ref" y "update" del módulo de Firebase Realtime Database
import { ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

export { changeSemanaSelect };

// Evento para actualizar el estado al cambiar el select
// Comentario para referencia
// estado-select es un elemento <select> con la clase 'estado-select' y un atributo data-id que contiene el ID del usuario
// Ejemplo: <select class="estado-select" data-id="${user.id}">

// Semana
// Definimos la función changeSemanaSelectEvent que se ejecuta cuando se cambia el valor de un elemento select
function changeSemanaSelect(tabla, database, collection) {
  // Añadimos un event listener al elemento tabla para escuchar cambios en los elementos select
  tabla.addEventListener("change", function (event) {
    // Verificamos si el elemento cambiado tiene la clase 'estado-select'
    if (event.target.classList.contains("semana-select")) {
      // Preguntamos al usuario si está seguro de cambiar el estado
      const confirmar = confirm("¿Estás seguro de que deseas cambiar número de semana?");
      if (confirmar) {
        // Obtenemos el ID del elemento a partir del atributo data-id del select
        const id = event.target.getAttribute("data-id");
        // Obtenemos el nuevo estado seleccionado
        const nuevoSemana = event.target.value;

        // Actualizamos el estado en la base de datos en la ruta especificada
        update(ref(database, `${collection}/${id}`), { semana: nuevoSemana })
          .then(() => {
            // Mostramos un mensaje de éxito en la consola
            console.log("Estado actualizado exitosamente");
          })
          .catch((error) => {
            // Mostramos un mensaje de error en la consola si la actualización falla
            console.error("Error al actualizar el estado:", error);
          });
      } else {
        // Si el usuario cancela la operación, volvemos a mostrar los datos originales
        mostrarDatos();
      }
    }
  });
}
