// signupForm.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { auth, database } from "../environment/firebaseConfig.js";

const signupForm = document.querySelector("#modalForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const unidadInput = document.getElementById("validationCustomUnidad").value;
    const placaInput = document.getElementById("validationCustomPlaca").value;
    const nombreInput = document.getElementById("validationCustomNombre").value;
    const cedulaInput = document.getElementById("validationCustomCedula").value;
    const whatsappInput = document.getElementById("validationCustomWhatsapp").value;
    const emailInput = document.getElementById("validationCustomEmail").value;
    const passwordInput = document.getElementById("validationCustomPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      const user = userCredential.user;

      const nuevoRegistro = {
        unidad: unidadInput,
        placa: placaInput,
        nombre: nombreInput,
        cedula: cedulaInput,
        whatsapp: whatsappInput,
        email: emailInput,
        userId: user.uid // Guardar el UID del usuario registrado
      };

      const referenciaUnidades = ref(database, collection);

      await push(referenciaUnidades, nuevoRegistro);

      document.getElementById("modalForm").reset();
      const myModalEl = document.getElementById("myModal");
      const myModal = bootstrap.Modal.getInstance(myModalEl);
      myModal.hide();

      alert("¡Registro exitoso!");
      setTimeout(() => {
        location.reload();
      }, 100);

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("¡Este correo ya está en uso!, intente iniciar sesión o crear otro distinto a este.", "error");
      } else if (error.code === "auth/invalid-email") {
        alert("¡Correo inválido!, verifique que esté bien escrito e intente nuevamente.", "error");
      } else if (error.code === "auth/weak-password") {
        alert("¡Esta contraseña es corta y/o insegura!, se recomienda tener 8 caracteres o más, de lo posible combíne letras minúscula con mayúscula y número.", "error");
      } else if (error.code) {
        alert("¡Algo ha salido mal!, no logro detectar el error.", "error");
      }
      console.error("Error al registrar al usuario:", error);
    }
  });
} else {
  console.log("El formulario con ID 'modalForm' no se encontró, 'signup_Form.js' no se ejecutará.");
}
