// main.js - Controlador principal de la SPA
import { fetchUsers, createUser, deleteUser, updateUser } from "./api.js";
import { openModal, closeModal, fillForm, clearForm } from "./modal.js";

// Referencias al DOM
const userTableBody = document.getElementById("user-table-body");
const btnAddUser = document.getElementById("btn-add-user");
const modalClose = document.getElementById("modal-close");
const form = document.getElementById("user-form");

// Cargar usuarios y mostrarlos en la tabla
async function loadUsers() {
const users = await fetchUsers();
  userTableBody.innerHTML = ""; // Limpiar tabla

users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.phone}</td>
    <td>${user.enrollNumber}</td>
    <td>${user.dateOfAdmission}</td>
    <td>
        <button onclick='editUser(${user.id})'>Editar</button>
        <button onclick='removeUser(${user.id})'>Eliminar</button>
    </td>
    `;
    userTableBody.appendChild(row);
});
}

// Función global para editar (SPA: reutiliza modal y datos del usuario)
window.editUser = async (id) => {
const users = await fetchUsers();
const user = users.find(u => u.id === id);
fillForm(user);
openModal();
};

// Función global para eliminar usuario
window.removeUser = async (id) => {
if (confirm("¿Estás seguro de eliminar este usuario?")) {
    await deleteUser(id);
    loadUsers();
}
};

// Abrir modal para nuevo usuario
btnAddUser.addEventListener("click", () => {
clearForm();
openModal();
});

// Cerrar modal
modalClose.addEventListener("click", () => closeModal());

// Guardar (crear o editar)
form.addEventListener("submit", async (e) => {
e.preventDefault();

const id = document.getElementById("user-id").value;
const newUser = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    enrollNumber: document.getElementById("enrollNumber").value,
    dateOfAdmission: document.getElementById("dateOfAdmission").value,
};

if (id) {
    await updateUser(id, newUser);
} else {
    await createUser(newUser);
}

closeModal();
loadUsers();
});

// Cargar los datos al iniciar
loadUsers();
