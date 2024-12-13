import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'; 
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, getDoc, deleteDoc, query, orderBy, limit, startAfter } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Configuración de Firebase (reemplaza con tus propias credenciales)
const firebaseConfig = {
    apiKey: "AIzaSyA7mj04k2OC2NSimCdubUIlAa53Ovp9x6I",
    authDomain: "clinicalservices-acd5b.firebaseapp.com",
    projectId: "clinicalservices-acd5b",
    storageBucket: "clinicalservices-acd5b.firebasestorage.app",
    messagingSenderId: "1016986943641",
    appId: "1:1016986943641:web:75b5e0bfc5671961b0f808",
    measurementId: "G-RY531V66CW"
};

// Inicializar Firebase solo si no existe una instancia ya inicializada
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Obtener la instancia de Firestore
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // Obtener los elementos
    const formularioGenerar = document.getElementById('formularioGenerar');
    const formRowGenerar = document.querySelector('.form-row-generar');
    const btnRegistrar = document.querySelector('.footer-btn-registrar');
    const tableBody = document.getElementById("BaseDatos").getElementsByTagName('tbody')[0];
    const paginationControls = document.getElementById('pagination-controls');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    let currentPage = 1;
    const recordsPerPage = 5;
    let lastVisible = null; // Para manejar la paginación

    // Mostrar y ocultar el formulario al hacer clic en "Registrar"
    btnRegistrar.addEventListener('click', () => {
        // Alternar la visibilidad del formulario
        if (formRowGenerar.style.display === 'none' || formRowGenerar.style.display === '') {
            formRowGenerar.style.display = 'block'; // Mostrar el formulario
        } else {
            formRowGenerar.style.display = 'none'; // Ocultar el formulario
        }
    });

    // Función para manejar el registro en Firebase
    formularioGenerar.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario

        const empresa = document.getElementById('generarEmpresa').value;
        const representante = document.getElementById('generarRepresantente').value;
        const celular = document.getElementById('generarCelular').value.replace(/\D/g, ''); // Elimina espacios
        const telefono = document.getElementById('generarTelefono').value;
        const correo = document.getElementById('generarCorreo').value;
        const observacion = document.getElementById('generarObservacion').value;

        try {
            // Agregar el nuevo registro a Firestore
            const docRef = await addDoc(collection(db, "contactos"), {
                empresa: empresa,
                representante: representante,
                celular: celular,
                telefono: telefono,
                correo: correo,
                observacion: observacion
            });

            console.log("Documento escrito con ID: ", docRef.id); // Muestra el ID del documento
            alert('Registro guardado con éxito');
            formularioGenerar.reset(); // Limpiar el formulario
            formRowGenerar.style.display = 'none'; // Oculta el formulario después de enviar
        } catch (error) {
            console.error('Error al guardar el registro: ', error);
            alert('Error al guardar el registro, intenta nuevamente');
        }
    });

    // Función para cargar los registros con paginación
    const loadContacts = (querySnapshot) => {
        // Limpiar la tabla antes de llenarla de nuevo
        tableBody.innerHTML = '';

        // Iterar sobre los documentos en la colección
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td>${doc.id}</td>
                <td>${data.empresa}</td>
                <td>${data.representante}</td>
                <td>${data.celular}</td>
                <td>${data.telefono}</td>
                <td>${data.correo}</td>
                <td>${data.observacion}</td>
                <td>
                    <button class="edit-btn" data-id="${doc.id}">Editar</button>
                    <button class="delete-btn" data-id="${doc.id}">Eliminar</button>
                </td>
            `;
        });

        // Agregar eventos para los botones de editar
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const docId = event.target.dataset.id;
                openEditModal(docId);
            });
        });

        // Agregar eventos para los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const docId = event.target.dataset.id;
                deleteContact(docId);
            });
        });
    };

    // Escuchar cambios en la colección de "contactos" con paginación
    const loadPaginatedContacts = () => {
        let contactsQuery = query(
            collection(db, "contactos"),
            orderBy("empresa"), // Cambiar según el criterio que desees
            limit(recordsPerPage)
        );

        if (lastVisible) {
            contactsQuery = query(
                contactsQuery,
                startAfter(lastVisible)
            );
        }

        onSnapshot(contactsQuery, (querySnapshot) => {
            loadContacts(querySnapshot);
            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]; // Establecer el último documento
            updatePagination(querySnapshot.size);
        });
    };

    // Cargar los primeros registros al iniciar
    loadPaginatedContacts();

    // Función para abrir el modal de edición
    function openEditModal(docId) {
        const modal = document.getElementById('editModal');
        const form = modal.querySelector('form');

        // Obtener los datos del documento de Firestore
        const contactoRef = doc(db, "contactos", docId);
        getDoc(contactoRef).then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                form['empresa'].value = data.empresa;
                form['representante'].value = data.representante;
                form['celular'].value = data.celular;
                form['telefono'].value = data.telefono;
                form['correo'].value = data.correo;
                form['observacion'].value = data.observacion;
                form['docId'].value = docId;
                modal.style.display = 'block'; // Mostrar el modal
            } else {
                alert('No se encontraron datos para editar');
            }
        });
    }

    // Función para actualizar un contacto en Firestore
    const editForm = document.getElementById('editForm');
    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const docId = editForm['docId'].value;
        const empresa = editForm['empresa'].value;
        const representante = editForm['representante'].value;
        const celular = editForm['celular'].value.replace(/\D/g, '');
        const telefono = editForm['telefono'].value;
        const correo = editForm['correo'].value;
        const observacion = editForm['observacion'].value;

        try {
            const contactoRef = doc(db, "contactos", docId);
            await updateDoc(contactoRef, {
                empresa: empresa,
                representante: representante,
                celular: celular,
                telefono: telefono,
                correo: correo,
                observacion: observacion
            });

            alert('Registro actualizado con éxito');
            closeEditModal(); // Cerrar el modal
        } catch (error) {
            console.error('Error al actualizar el registro: ', error);
            alert('Error al actualizar el registro, intenta nuevamente');
        }
    });

    // Función para cerrar el modal de edición
    function closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.style.display = 'none';
    }

    // Función para eliminar un contacto
    async function deleteContact(docId) {
        try {
            const contactoRef = doc(db, "contactos", docId);
            await deleteDoc(contactoRef);
            alert('Registro eliminado con éxito');
        } catch (error) {
            console.error('Error al eliminar el registro: ', error);
            alert('Error al eliminar el registro, intenta nuevamente');
        }
    }

    // Función para actualizar los controles de paginación
    function updatePagination(totalRecords) {
        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        document.getElementById('pageNumber').textContent = `Página ${currentPage}`;
    }

    // Control de paginación
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPaginatedContacts();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        loadPaginatedContacts();
    });

    // Cerrar el modal cuando se hace clic fuera de él
    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target == modal) {
            closeEditModal();
        }
    };

    // Función para validar el correo
    function validarCorreo() {
        const correo = document.getElementById('generarCorreo').value;
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!regex.test(correo)) {
            alert("El correo no es válido");
        }
    }

    // Agregar evento de validación de correo
    document.getElementById('generarCorreo').addEventListener('blur', validarCorreo);
});
