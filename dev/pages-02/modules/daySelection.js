// Esperar a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".day-button");
    const tabla = document.getElementById("miTabla");

    // Añadir evento de clic a todos los botones
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
});

// Función para mostrar solo la columna correspondiente al día seleccionado
function mostrarColumnaSeleccionada(diaSeleccionado) {
    const tabla = document.getElementById("miTabla");
    const columnas = tabla.querySelectorAll("th[data-day], td[data-day]");

    // Ocultar todas las columnas inicialmente
    columnas.forEach(columna => {
        columna.style.display = "none";
    });

    // Mostrar solo la columna correspondiente al día seleccionado
    tabla.querySelectorAll(`[data-day="${diaSeleccionado}"]`).forEach(columna => {
        columna.style.display = "";
    });
}
