let editId = null;

const userForm = document.getElementById('userForm');
const userId = document.getElementById('userId');
const nombre = document.getElementById('name');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const userTableBody = document.getElementById('userTableBody');
const cancelBtn = document.getElementById('cancelBtn');

// 1. FUNCIÓN PARA TRAER LOS USUARIOS DESDE LA NUBE
async function mostrarUsuarios() {
    if (!userTableBody) return;

    try {
        // Llamamos a la función de Netlify
        const respuesta = await fetch('/.netlify/functions/obtener-usuarios');
        const users = await respuesta.json();

        // Si no hay registros en la base de datos
        if (users.length === 0) {
            userTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #5A5A55;">
                        No hay usuarios registrados
                    </td>
                </tr>
            `;
            return;
        }

        // Si hay registros, los dibujamos en la tabla
        userTableBody.innerHTML = '';
        users.forEach(user => {
            userTableBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.telefono || 'N/A'}</td>
                    <td>
                        <button class="btn btn-primary" onclick="prepararEditar(${user.id})">Editar</button>
                        <button class="btn btn-secundary" style="background-color: #ff4d4d; color:white;">Borrar</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando usuarios:", error);
        userTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error al conectar con la base de datos</td></tr>`;
    }
}

// 2. EVENTO PARA GUARDAR DATOS DEL FORMULARIO EN LA NUBE
userForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue

    const datosUsuario = {
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value
    };

    try {
        // Enviamos los datos al backend usando POST
        const respuesta = await fetch('/.netlify/functions/guardar-usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUsuario)
        });

        if (respuesta.ok) {
            userForm.reset(); // Limpiamos los inputs del formulario
            mostrarUsuarios(); // Recargamos la tabla automáticamente para ver el nuevo registro
        } else {
            alert("Hubo un error al guardar el usuario.");
        }

    } catch (error) {
        console.error("Error al enviar formulario:", error);
    }
});

// Cargar la lista automáticamente al abrir la página
mostrarUsuarios();