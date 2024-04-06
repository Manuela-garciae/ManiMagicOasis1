//fetch resgristro
if (localStorage.getItem('logeado')) {
    window.location = '/'
}

document.getElementById('register').addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    if (password == passwordConfirm) {

        const datos = {
            "nombre": nombre,
            "telefono": telefono,
            "email": email,
            "password": password
        }

        try {
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            }).then((response) => {
                console.log(response);
                if (response.ok) {
                    // Redirigir al usuario al login.html
                    window.location.href = "/";
                    datos.loggin = true;
                    localStorage.setItem('logeado', JSON.stringify(datos));
                } else {
                    const errorMessage = response.text();
                    alert(errorMessage);
                }
            }).catch((error) => {
                console.log("🚀 ~ document.getElementById ~ error:", error)
                console.log('Ha cometido un error el sistema');
            });


        } catch (error) {
            console.error("Error al registrar", error);
            alert("Error al registrar. Por favor, intenta nuevamente.");
        }
    } else {
        alert('El password que usted ha provisto no es igual a la confirmación');
    }

});
