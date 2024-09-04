export let currentPage = 1;
export let itemsPerPage = 50; // Puedes mantener esto si lo estás usando en otro lugar

export function updatePagination(totalPages, mostrarDatos) {
  const paginationContainer = document.querySelector(".pagination");
  const prevPageBtn = paginationContainer.querySelector("#prevPage");
  const nextPageBtn = paginationContainer.querySelector("#nextPage");
  
  // Actualizar botones prev/next
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  // Elimina todos los elementos de número de página excepto los botones de prev y next
  paginationContainer.querySelectorAll(".pageNumber:not(.prev-page):not(.next-page)").forEach(page => page.remove());

  // Calcula el rango de páginas a mostrar
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (startPage === 1 && totalPages > 2) endPage = 3;
  if (endPage === totalPages && totalPages > 2) startPage = totalPages - 2;

  // Genera los elementos de paginación
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("pageNumber");
    if (i === currentPage) pageItem.classList.add("active");
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    pageItem.appendChild(pageLink);

    nextPageBtn.parentElement.before(pageItem);

    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      mostrarDatos();
      updatePagination(totalPages, mostrarDatos);
    });
  }

  // Event listeners para botones prev/next
  prevPageBtn.removeEventListener("click", handlePrevPage);
  prevPageBtn.addEventListener("click", () => handlePrevPage(totalPages, mostrarDatos));
  nextPageBtn.removeEventListener("click", handleNextPage);
  nextPageBtn.addEventListener("click", () => handleNextPage(totalPages, mostrarDatos));
}

function handlePrevPage(totalPages, mostrarDatos) {
  if (currentPage > 1) {
    currentPage--;
    mostrarDatos();
    updatePagination(totalPages, mostrarDatos);
  }
}

function handleNextPage(totalPages, mostrarDatos) {
  if (currentPage < totalPages) {
    currentPage++;
    mostrarDatos();
    updatePagination(totalPages, mostrarDatos);
  }
}
