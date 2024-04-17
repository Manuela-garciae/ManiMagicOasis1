if (!localStorage.getItem('logeado')) {
    window.location = '/'
}
let datalogeado = JSON.parse(localStorage.getItem('logeado'));

document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('logeado');
    window.location = '/';
});

document.getElementById('perfil').innerHTML = `<h3>${datalogeado.nombre}</h3>`;

function toggleFavorite() {
    var icon = document.getElementById("favorite-icon");
    icon.classList.toggle("fa-star-o"); // Agregar o quitar la clase 'fa-star-o' para cambiar el icono
}
let arreglo = Array.from(document.querySelectorAll('.fa-star'));

arreglo.forEach(function (myIcon) {
    myIcon.onclick = function () {
        if (!myIcon.classList.contains('active')) {
            myIcon.classList.add('active');
            myIcon.classList.remove('fa-star');
            myIcon.classList.add('fa-check');

            localStorage.setItem(myIcon.id, 'active');
        } else {
            myIcon.classList.remove('active');
            myIcon.classList.remove('fa-check');
            myIcon.classList.add('fa-star');

            localStorage.setItem(myIcon.id, 'inactive');
        }
    }
    const iconState = localStorage.getItem(myIcon.id);
    if (iconState === 'active') {
        myIcon.classList.add('active');
        myIcon.classList.remove('fa-star');
        myIcon.classList.add('fa-check');
    } else {
        myIcon.classList.remove('fa-check');
        myIcon.classList.add('fa-star');
    }
});

if (localStorage.getItem('logeado')) {
    document.getElementById('iniciosession').style.display = 'none';
    document.getElementById('logout').style.display = 'visible';
} else {
    document.getElementById('iniciosession').style.display = 'visible';
    document.getElementById('logout').style.display = 'none';
}

document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('logeado');
    window.location = '/';
});