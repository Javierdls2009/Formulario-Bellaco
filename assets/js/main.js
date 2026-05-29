let users = [];
let editId = null;

const userForm = document.getElementById('userForm');
const userId = document.getElementById('userId');
const nombre = document.getElementById('name');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const userTableBody = document.getElementById('userTableBody');
const cancelBtn = document.getElementById('cancelBtn');

function mostarUsuarios() {
    if (!userTableBody) return;

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
}
mostarUsuarios();