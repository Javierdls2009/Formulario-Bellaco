let localUsers = [];

const userForm = document.getElementById('userForm');
const userId = document.getElementById('userId');
const nombre = document.getElementById('name');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const userTableBody = document.getElementById('userTableBody');
const cancelBtn = document.getElementById('cancelBtn');

async function mostrarUsuarios() {
    if (!userTableBody) return;

    try {
        const respuesta = await fetch('/.netlify/functions/obtener-usuarios');
        localUsers = await respuesta.json();

        if (localUsers.length === 0) {
            userTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #5A5A55;">
                        No hay usuarios registrados
                    </td>
                </tr>
            `;
            return;
        }

        userTableBody.innerHTML = '';
        localUsers.forEach(user => {
            userTableBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.telefono || 'N/A'}</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-table btn-edit" onclick="prepararEditar(${user.id})">Editar</button>
                            <button class="btn-table btn-delete" onclick="borrarUsuario(${user.id})">Borrar</button>
                        </div>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando usuarios:", error);
        userTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error al conectar con la base de datos</td></tr>`;
    }
}

function prepararEditar(id) {
    const usuarioAEditar = localUsers.find(u => u.id === id);
    if (!usuarioAEditar) return;

    userId.value = usuarioAEditar.id;
    nombre.value = usuarioAEditar.nombre;
    email.value = usuarioAEditar.email;
    telefono.value = usuarioAEditar.telefono || '';

    const submitBtn = userForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Actualizar";
}

cancelBtn.addEventListener('click', () => {
    userForm.reset();
    userId.value = '';
    const submitBtn = userForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Guardar";
});

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = userId.value;
    const datosUsuario = {
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value
    };

    try {
        let respuesta;
        
        if (id) {
            datosUsuario.id = id;
            respuesta = await fetch('/.netlify/functions/editar-usuario', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosUsuario)
            });
        } else {
            respuesta = await fetch('/.netlify/functions/guardar-usuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosUsuario)
            });
        }

        if (respuesta.ok) {
            userForm.reset();
            userId.value = '';
            const submitBtn = userForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Guardar";
            mostrarUsuarios();
        } else {
            alert("Hubo un error al procesar el usuario.");
        }

    } catch (error) {
        console.error("Error al enviar formulario:", error);
    }
});

async function borrarUsuario(id) {
    if (!confirm("¿De verdad quieres eliminar este usuario de la base de datos?")) return;

    try {
        const respuesta = await fetch('/.netlify/functions/borrar-usuario', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });

        if (respuesta.ok) {
            mostrarUsuarios(); // Refrescamos la tabla tras eliminar
        } else {
            alert("No se pudo eliminar el usuario.");
        }
    } catch (error) {
        console.error("Error eliminando usuario:", error);
    }
}

mostrarUsuarios();