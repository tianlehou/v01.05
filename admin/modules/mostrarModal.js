// mostrarModal.js
export function mostrarModal() {
  // Limpiar los campos del formulario modal antes de mostrar el modal
  console.log("Limpiando formulario antes de mostrar el modal");
  document.getElementById("registerForm").reset();

  const myModal = new bootstrap.Modal(document.getElementById("registerModal"));
  myModal.show();
}
