// pagination.js

export let currentPage = 1;
export let itemsPerPage = 100;

export function updatePagination(totalPages, mostrarDatos) {
  const paginationContainer = document.querySelector(".pagination");
  const prevPageBtn = paginationContainer.querySelector("#prevPage");
  const nextPageBtn = paginationContainer.querySelector("#nextPage");

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  paginationContainer.querySelectorAll(".pageNumber:not(.prev-page):not(.next-page)").forEach(page => page.remove());

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (startPage === 1 && totalPages > 2) endPage = 3;
  if (endPage === totalPages && totalPages > 2) startPage = totalPages - 2;

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

  prevPageBtn.removeEventListener("click", handlePrevPage);
  prevPageBtn.addEventListener("click", handlePrevPage);
  nextPageBtn.removeEventListener("click", handleNextPage);
  nextPageBtn.addEventListener("click", handleNextPage);

  document.getElementById("itemsPerPageSelect").addEventListener("change", function () {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    mostrarDatos();
    updatePagination(totalPages, mostrarDatos);
  });
}

function handlePrevPage() {
  if (currentPage > 1) {
    currentPage--;
    mostrarDatos();
    updatePagination(totalPages, mostrarDatos);
  }
}

function handleNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    mostrarDatos();
    updatePagination(totalPages, mostrarDatos);
  }
}
