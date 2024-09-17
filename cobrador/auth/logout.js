// ../auth/checkAuth.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from '../environment/firebaseConfig.js';

document.addEventListener("DOMContentLoaded", () => {
    // Verifica el estado de autenticación
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Si no hay usuario autenticado, redirige a la página de inicio de sesión
            window.location.href = "../login.html";
        }
    });
});
