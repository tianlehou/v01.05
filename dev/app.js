import "./auth/signin_Form.js";
import "./modules/showHidePassword/showHidePassword.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signInForm');
    const emailInput = document.getElementById('signInUsernameOrEmail');
    const passwordInput = document.getElementById('signInPassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const signInSuccess = document.getElementById('signInSuccess');
  
    // Expresión regular para validar un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    form.addEventListener('submit', (e) => {
      // Evitar que el formulario se envíe antes de la validación
      e.preventDefault();
  
      // Limpiar mensajes de error anteriores
      emailError.textContent = '';
      passwordError.textContent = '';
      signInSuccess.textContent = '';
  
      let isValid = true;
  
      // Validar correo electrónico
      if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Por favor ingresa un correo electrónico válido.';
        isValid = false;
      }
  
      // Validar contraseña no vacía
      if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Por favor ingresa tu contraseña.';
        isValid = false;
      }
  
      // Si todas las validaciones pasan, puedes hacer el envío del formulario o mostrar un mensaje de éxito
      if (isValid) {
        // Aquí puedes agregar la lógica de autenticación o mostrar un mensaje de éxito
        signInSuccess.textContent = 'Inicio de sesión exitoso!';
      }
    });
  });
  