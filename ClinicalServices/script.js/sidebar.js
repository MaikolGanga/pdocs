// Función para alternar el estado del sidebar y mover el contenido principal
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const menuIcon = document.querySelector('.menu-btn i'); // Seleccionar el ícono del menú

    // Alterna la clase 'open' en el sidebar para abrir/cerrar el menú
    sidebar.classList.toggle('open');

    // Alterna la clase 'sidebar-open' en el contenido principal
    mainContent.classList.toggle('sidebar-open');

    // Si el sidebar está abierto, movemos el main-content 230px a la derecha
    if (sidebar.classList.contains('open')) {
        mainContent.style.transition = 'margin-left 0.3s ease'; // Asegura una transición suave
        mainContent.style.marginLeft = '230px'; // Mover el contenido principal a la derecha
    } else {
        mainContent.style.transition = 'margin-left 0.3s ease'; // Asegura una transición suave
        mainContent.style.marginLeft = '0'; // Volver a la posición original cuando el sidebar está cerrado
    }

    // Alterna la rotación y desplazamiento del ícono
    menuIcon.classList.toggle('rotate-90');
}

// Asegúrate de que cuando la página cargue el contenido esté movido a la derecha si el sidebar está abierto
window.addEventListener('load', function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Si el sidebar tiene la clase 'open' por defecto, mueve el main-content
    if (sidebar.classList.contains('open')) {
        mainContent.style.marginLeft = '230px';
    }

    // Mostrar la fecha al cargar la página
    mostrarFechaActual();
});

// Función para mostrar y ocultar el contenedor principal y mostrar la sección correspondiente
function showSection(sectionId) {
    // Ocultar el contenedor principal
    const contenedorPrincipal = document.querySelector('.contenedor-principal');
    contenedorPrincipal.style.display = 'none';

    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.contenedor-seccion');
    sections.forEach(function(section) {
        section.classList.remove('open');
        section.style.display = 'none';  // Ocultamos las secciones
    });

    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('open');
        selectedSection.style.display = 'block'; // Mostramos la sección seleccionada
    }
}

// Función para cargar el formulario dentro del contenedor main-content
function cargarFormulario(url) {
    const mainContent = document.getElementById('main-content'); // Seleccionamos el contenedor de contenido principal
    mainContent.innerHTML = ''; // Limpiamos cualquier contenido previamente cargado

    // Creamos un iframe para cargar el formulario
    const iframe = document.createElement('iframe');
    iframe.src = url; // Establecemos la URL del formulario a cargar
    iframe.width = "100%"; // Establecemos el ancho del iframe
    iframe.height = "600px"; // Establecemos una altura adecuada para el iframe

    // Añadimos el iframe al contenedor main-content
    mainContent.appendChild(iframe);
}

// Función para cargar la página principal (bienvenida.html)
function cargarPaginaPrincipal() {
    const mainContent = document.getElementById("main-content");

    // Crear un nuevo iframe
    const iframe = document.createElement("iframe");

    // Establecer atributos del iframe
    iframe.src = "project-folder/bienvenida/bienvenida.html"; // Ruta al archivo HTML
    iframe.style.width = "100%"; // Ajustar el ancho al 100% de la pantalla
    iframe.style.height = "100%"; // Ajustar la altura al 100% del contenedor
    iframe.frameBorder = "0"; // Eliminar borde del iframe

    // Limpiar el contenido previo de <main> y agregar el iframe
    mainContent.innerHTML = ""; // Eliminar cualquier contenido anterior
    mainContent.appendChild(iframe); // Agregar el iframe al contenedor
}

// Función para mostrar solo el contenedor principal y ocultar todas las otras secciones
function mostrarPaginaPrincipal() {
    // Ocultar todas las secciones de contenido
    const contenedorPrincipal = document.querySelector('.contenedor-principal');
    contenedorPrincipal.style.display = 'block'; // Asegura que el contenedor principal esté visible

    // Ocultar todas las secciones activas
    const secciones = document.querySelectorAll('.contenedor-seccion');
    secciones.forEach(function (seccion) {
        seccion.classList.remove('active');
        seccion.style.display = 'none'; // Ocultar cada sección
    });

    // Llamar a la función que carga la página principal (bienvenida.html)
    cargarPaginaPrincipal();
}

// Función para alternar el submenú de una sección
function toggleSubmenu(item) {
    // Encuentra el submenú relacionado
    const submenu = item.nextElementSibling;

    // Cierra todos los submenús
    const allSubmenus = document.querySelectorAll('.submenu');
    allSubmenus.forEach(function(sub) {
        if (sub !== submenu) {
            sub.style.display = 'none';  // Cerrar todos los submenús que no sean el seleccionado
            sub.previousElementSibling.querySelector('.fa-chevron-right').classList.remove('rotated');  // Revertir la rotación de las flechas
        }
    });

    // Alterna la visibilidad del submenú
    if (submenu) {
        if (submenu.style.display === '' || submenu.style.display === 'none') {
            submenu.style.display = 'block'; // Abrir el submenú
            item.querySelector('.fa-chevron-right').classList.add('rotated'); // Girar la flecha
        } else {
            submenu.style.display = 'none';  // Cerrar el submenú
            item.querySelector('.fa-chevron-right').classList.remove('rotated'); // Revertir la rotación de las flechas
        }
    }
}

// Función para manejar la visibilidad del submenú dinámicamente
let submenuAbierto = null;

function toggleSubmenuDynamic(element) {
    const submenu = element.nextElementSibling; // Obtiene el siguiente elemento (el submenú)
    const chevronIcon = element.querySelector('i.fas.fa-chevron-right'); // Selecciona el icono de chevron
    
    // Si hay un submenú abierto, lo cerramos
    if (submenuAbierto && submenuAbierto !== submenu) {
        submenuAbierto.style.display = 'none';
        // Restaura la rotación del icono
        const prevChevron = submenuAbierto.previousElementSibling.querySelector('i.fas.fa-chevron-right');
        if (prevChevron) {
            prevChevron.classList.remove('rotated');
        }
    }
    
    // Alternamos la visibilidad del submenú seleccionado
    if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
        submenuAbierto = null;  // Si se cierra el submenú, lo restablecemos a null
        // Restaura la rotación del icono
        if (chevronIcon) {
            chevronIcon.classList.remove('rotated');
        }
    } else {
        submenu.style.display = 'block';
        submenuAbierto = submenu;  // Guardamos el submenú que se ha abierto
        // Aplica la rotación al icono
        if (chevronIcon) {
            chevronIcon.classList.add('rotated');
        }
    }
}

// Función para obtener y mostrar la fecha actual en el formato deseado
function mostrarFechaActual() {
    const dateElement = document.getElementById('date');
    const fecha = new Date();

    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones); // Formato de fecha en español
    dateElement.textContent = fechaFormateada; // Mostrar la fecha en el elemento con id="date"
}

// Función para mostrar la confirmación de logout
function showLogoutConfirmation() {
    const confirmationDiv = document.getElementById('logout-confirmation');
    confirmationDiv.style.display = 'block'; // Mostrar el div de confirmación
}

// Función para redirigir al index.html si se confirma el logout
function logout() {
    window.location.href = 'index.html'; // Redirige a la página de inicio
}

// Función para ocultar el cuadro de confirmación de salida si se cancela
function cancelLogout() {
    const confirmationDiv = document.getElementById('logout-confirmation');
    confirmationDiv.style.display = 'none'; // Oculta el div de confirmación
}

// Agregar eventos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar la fecha cuando se cargue la página
    mostrarFechaActual();

    // Agregar un intervalo para actualizar la fecha cada minuto
    setInterval(mostrarFechaActual, 60000); // Actualiza la fecha cada 60,000 ms (1 minuto)

    // Agregar eventos de clic en los enlaces de la barra lateral
    const links = document.querySelectorAll('.formulario-link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evitamos que el enlace haga su acción por defecto

            const target = this.getAttribute('data-target'); // Obtenemos la ruta del formulario desde el atributo data-target
            cargarFormulario(target); // Llamamos a la función para cargar el formulario
        });
    });

    // Agregar eventos para los enlaces de las secciones
    const sectionLinks = document.querySelectorAll('.contenedor-principal ul li a');
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(targetId);
        });
    });

    // Llamar a cargarPaginaPrincipal al cargar la página
    cargarPaginaPrincipal(); // Cargar bienvenida.html
});
