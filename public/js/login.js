import {BASE_URL} from "./constans.js";
if( localStorage.getItem('logeado') ){ 
    window.location = '/'
  }
  ///fetch de login 
  document.getElementById('forms').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto
///boton
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${BASE_URL}/forms`, {
        method: 'post',
        //objeto json
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).then((response) => response.json())
        .then(async (response) => {
          console.log(response);

          if (response.result == 'ok') {
            localStorage.setItem('logeado', JSON.stringify(response.user));
            // Redirigir al usuario al dashboard
            window.location.href = "dashboard.html";
          } else {
            const errorMessage = 'Error al iniciar sesion, Verifique los datos ingresados';
            alert(errorMessage);
          }
        }).catch((error) => {
          alert(error);
        });
    } catch (error) {
      alert("Error al iniciar sesión. Por favor, intenta nuevamente.");
    }
  });