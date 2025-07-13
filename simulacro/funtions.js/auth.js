import { renderView } from './router.js';

const ADMIN_USER_KEY = 'adminUser';
const IS_AUTHENTICATED_KEY = 'isAuthenticated';
const LOGGED_IN_USER_KEY = 'loggedInUser';

// Función para inicializar el usuario administrador por defecto si no existe
const initializeDefaultAdminUser = () => {
    if (!localStorage.getItem(ADMIN_USER_KEY)) {
        const defaultAdmin = {
            name: 'Administrador',
            email: 'admi123',
            password: 'admi123'
        };
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(defaultAdmin));
        console.log('Usuario administrador por defecto creado: admi123 / admi123');
    }
};

// Llama a esta función una vez al inicio del módulo
initializeDefaultAdminUser();


export const setupAuthListeners = (onLoginSuccess, onRegisterSuccess, onNavigateToLogin, onNavigateToRegister) => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // Manejo del formulario de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            // Aquí simulamos el registro guardando en localStorage
            // En un caso real, esto iría a un backend seguro.
            const user = { name, email, password };
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            onRegisterSuccess(); // Llama al callback para notificar a main.js
        });
    }

    // Manejo del formulario de Inicio de Sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const storedUser = JSON.parse(localStorage.getItem(ADMIN_USER_KEY));

            if (storedUser && storedUser.email === email && storedUser.password === password) {
                // Autenticación exitosa
                localStorage.setItem(IS_AUTHENTICATED_KEY, 'true');
                localStorage.setItem(LOGGED_IN_USER_KEY, storedUser.name);
                alert('¡Inicio de sesión exitoso!');
                onLoginSuccess(); // Llama al callback para notificar a main.js
            } else {
                alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
            }
        });
    }

    // Navegación entre login y registro sin recargar la página
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            onNavigateToRegister();
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            onNavigateToLogin();
        });
    }
};

export const checkAuthStatus = () => {
    return localStorage.getItem(IS_AUTHENTICATED_KEY) === 'true';
};

export const logout = () => {
    localStorage.removeItem(IS_AUTHENTICATED_KEY);
    localStorage.removeItem(LOGGED_IN_USER_KEY);
};

export const getLoggedInUserName = () => {
    return localStorage.getItem(LOGGED_IN_USER_KEY);
};