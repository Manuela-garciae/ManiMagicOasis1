import {BASE_URL} from "./constans.js";
 
 ///buscar id logeado
 let datalogeado = JSON.parse(localStorage.getItem('logeado'));

 if (!localStorage.getItem('logeado')) {
     window.location = '/'
 } else {
     console.log(datalogeado);
     document.getElementById('nombre').value = datalogeado.nombre;
     document.getElementById('telefono').value = datalogeado.telefono;
     document.getElementById('email').value = datalogeado.email;
 }

 // aqui va el fetch a delete .
 document.getElementById('trash').addEventListener('click', (r) => {
     r.preventDefault();
     //alert confirmacion 
     const respuesta = confirm("¿Desea eliminar el usuario?");
     const id = datalogeado.id;
     if (respuesta) {
         fetch(`${BASE_URL}/usuarios/${id}`, {
             method: 'DELETE',
             headers: {
                 'Content-Type': 'application/json'
             }
         }).then((response) => {
             console.log(response);
             if (response.ok) {
                 // Redirigir al usuario al index
                 alert("Usuario eliminado");
                 localStorage.removeItem('logeado');
                 setTimeout(() => {
                     window.location.href = "/";
                 }, 400);
             } else {
                 const errorMessage = response.text();
                 alert(errorMessage);
             }
         }).catch((error) => {
             console.log("🚀 ~ document.getElementById ~ error:", error)
             console.log('Ha cometido un error el sistema');
         });
     }


 });


 //fetch actualizar 
 document.getElementById('editar').addEventListener('click', (r) => {
     r.preventDefault();
     // arriba datalogeado

     const id = datalogeado.id; 
     const nuevodato = {
         nombre: document.getElementById('nombre').value,
         telefono: document.getElementById('telefono').value,
         email: document.getElementById('email').value
     };

    
         fetch(`${BASE_URL}/usuarios/${id}`, {
             method: 'PUT',
             headers: {
                 //objeto json
                 'Content-Type': 'application/json'
             },body:JSON.stringify(nuevodato)
         }).then((response) => {
             console.log(response);
             if (response.ok) {
                 // se actualizo
                 alert("Usuario actualizado, debes volver a iniciar sesion");
                 localStorage.removeItem('logeado');
                 setTimeout(() => {
                     window.location.href = "/dashboard.html";
                 }, 400);
             } else {
                 const errorMessage = response.text();
                 alert("error al actualizar");
             }
         }).catch((error) => {
             console.log("🚀 ~ document.getElementById ~ error:", error)
             console.log('Ha cometido un error el sistema');
         });
 });     