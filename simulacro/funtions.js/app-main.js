import * as api from './api.js';
import * as ui from './ui-DOM.js';
import * as auth from './auth.js'; // Importa todas las funciones de auth
import { renderView } from './router.js';

// --- Funciones para manejar la lógica de cada vista ---

// Inicializa la vista del panel de administración y adjunta sus listeners
const initAdminPanel = async () => {
    renderView('admin'); // Asegura que la vista admin esté renderizada
    const usernameElement = document.getElementById('logged-in-username');
    if (usernameElement) {
        usernameElement.textContent = auth.getLoggedInUserName();
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
            alert('Has cerrado sesión.');
            checkAuthAndRender(); // Vuelve a la página de inicio (login)
        });
    }

    await loadUsers(); // Carga y renderiza los usuarios en la tabla

    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            ui.openModal('create');
        });
    }

    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = ui.getUserFormData();
            const isEditing = !!userData.id;

            if (isEditing) {
                const updatedUser = await api.updateUser(userData.id, userData);
                if (updatedUser) {
                    alert('Usuario actualizado exitosamente!');
                    ui.closeModal();
                    loadUsers();
                } else {
                    alert('Error al actualizar el usuario.');
                }
            } else {
                const newUser = await api.createUser(userData);
                if (newUser) {
                    alert('Usuario agregado exitosamente!');
                    ui.closeModal();
                    loadUsers();
                } else {
                    alert('Error al agregar el usuario.');
                }
            }
        });
    }

    ui.setupModalCloseListeners(); // Configura los listeners para el modal
};

// Carga y renderiza los usuarios desde la API
const loadUsers = async () => {
    const users = await api.getUsers();
    ui.renderUsers(users, handleEditUser, handleDeleteUser);
};

// Maneja la edición de un usuario
const handleEditUser = async (id) => {
    const user = await api.getUserById(id);
    if (user) {
        ui.openModal('edit', user);
    } else {
        alert('Usuario no encontrado para editar.');
    }
};

// Maneja la eliminación de un usuario
const handleDeleteUser = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        const success = await api.deleteUser(id);
        if (success) {
            alert('Usuario eliminado exitosamente!');
            loadUsers();
        } else {
            alert('Error al eliminar el usuario.');
        }
    }
};

// Inicializa la vista de autenticación (login o registro)
const initAuthView = (initialForm = 'login') => {
    renderView(initialForm); // Renderiza la vista de login o registro
    // setupAuthListeners debe pasarse callbacks que manejen el ruteo
    auth.setupAuthListeners(
        () => { // onLoginSuccess
            checkAuthAndRender(); // Después de login exitoso, verificar auth y renderizar admin
        },
        () => { // onRegisterSuccess
            initAuthView('login'); // Después de registrar, volver a la vista de login
        },
        () => { // onNavigateToLogin (desde el link "Inicia sesión aquí")
            initAuthView('login');
        },
        () => { // onNavigateToRegister (desde el link "Regístrate aquí")
            initAuthView('register');
        }
    );
};

// --- Función principal que controla el flujo de la aplicación (SPA Router) ---
const checkAuthAndRender = () => {
    if (auth.checkAuthStatus()) {
        initAdminPanel(); // Si está autenticado, muestra el panel de administración
    } else {
        initAuthView('login'); // Si no, muestra la vista de inicio de sesión
    }
};

// Ejecutar al cargar el DOM: Iniciar el proceso de autenticación/ruteo
document.addEventListener('DOMContentLoaded', checkAuthAndRender);