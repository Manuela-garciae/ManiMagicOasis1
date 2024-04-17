//acceso logout
import {BASE_URL} from "./constans.js";

if (localStorage.getItem('logeado')) {
    document.getElementById('iniciosession').style.display = 'none';
    document.getElementById('logout').style.display = 'visible';
  } else {
    document.getElementById('iniciosession').style.display = 'visible';
    document.getElementById('logout').style.display = 'none';
    sessionStorage.clear();
  }
  

  // activa el evento click IA (preguntar)
  document.getElementById('send').addEventListener('click', (e) => {
    e.preventDefault();
    // muestra el icono preload
    document.getElementById('preload').style.display = "block";
    // obtiene el valor
    const pregunta = document.getElementById('question').value.replace(/(\r\n|\n|\r)/gm, "");

    // ejecuta el fetch con la url ?info=
     fetch(`${BASE_URL}/openai?info=${pregunta}`)
      .then(response => response.json())
      .then(data => {
        // envio el dato recibido al texto respuesta
        document.getElementById('response').textContent = String(data.data.content);
        // oculto el icono preload
        document.getElementById('preload').style.display = "none";
        console.log(data);
        window.location = "#res"
      })
      .catch(e => console.log(e));
  });
  document.getElementById('clear').addEventListener('click', (e) => {
    e.preventDefault();
    window.location = "#quest";
    document.getElementById('question').value = '';
    document.getElementById('response').textContent = 'Esperando respuesta de IA';
  });