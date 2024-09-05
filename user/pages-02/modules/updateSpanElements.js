// Función para actualizar los elementos `<span>` basados en el valor de la celda
export function updateSpanElements(database, collection) {
    // Selecciona todos los elementos `span` dentro de la tabla.
    const spanElements = document.querySelectorAll("td span");

    // Itera sobre cada elemento `span` encontrado.
    spanElements.forEach((spanElement) => {
        // Obtiene el valor de texto dentro del `span`.
        const value = spanElement.textContent.trim();

        // Si el valor es "12.00" o "Completado", aplica estilos verdes.
        if (value === "12.00" || value === "Completado") {
            spanElement.style.color = "green";
            spanElement.style.fontWeight = "bold";
        // Si el valor es "pagado", añade un ícono o estilo especial.
        } else if (value === "pagado") {
            spanElement.style.color = "green";
            spanElement.innerHTML = '<span class="luz-verde"></span>';
        } else {
            // Para otros valores, restablece el estilo por defecto.
            spanElement.style.color = "black";
            spanElement.style.fontWeight = "normal";
        }
    });
}
