const appRoot = document.getElementById('app-root');

// Plantillas de contenido HTML
const loginView = `
    <div class="auth-container">
        <h2>Iniciar Sesión</h2>
        <form id="login-form">
            <div class="form-group">
                <label for="login-email">Usuario (Email):</label>
                <input type="email" id="login-email" required>
            </div>
            <div class="form-group">
                <label for="login-password">Contraseña:</label>
                <input type="password" id="login-password" required>
            </div>
            <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
            <p class="auth-switch">¿No tienes cuenta? <a href="#" id="show-register">Regístrate aquí</a></p>
        </form>
    </div>
`;

const registerView = `
    <div class="auth-container">
        <h2>Registro de Usuario</h2>
        <form id="register-form">
            <div class="form-group">
                <label for="register-name">Nombre Completo:</label>
                <input type="text" id="register-name" required>
            </div>
            <div class="form-group">
                <label for="register-email">Email (Usuario):</label>
                <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
                <label for="register-password">Contraseña:</label>
                <input type="password" id="register-password" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">Confirmar Contraseña:</label>
                <input type="password" id="confirm-password" required>
            </div>
            <button type="submit" class="btn btn-primary">Registrarse</button>
            <p class="auth-switch">¿Ya tienes cuenta? <a href="#" id="show-login">Inicia sesión aquí</a></p>
        </form>
    </div>
`;

const adminPanelView = `
    <div class="app-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>Admin Panel</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#" class="nav-item active">Usuarios</a></li>
                </ul>
            </nav>
        </aside>

        <main class="main-content">
            <header class="header">
                <h1>Gestión de Usuarios</h1>
                <div class="admin-info">
                    <span>Bienvenido, <strong id="logged-in-username"></strong></span>
                    <button class="btn btn-secondary" id="logout-btn">Cerrar Sesión</button>
                </div>
            </header>

            <section class="user-management-section">
                <div class="section-header">
                    <h2>Lista de Usuarios</h2>
                    <button class="btn btn-primary" id="add-user-btn">Agregar Nuevo Usuario</button>
                </div>

                <div class="table-container">
                    <table id="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Número de Matrícula</th>
                                <th>Fecha de Admisión</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>

    <div id="user-modal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2 id="modal-title">Agregar Usuario</h2>
            <form id="user-form">
                <input type="hidden" id="user-id">

                <div class="form-group">
                    <label for="name">Nombre Completo:</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Teléfono:</label>
                    <input type="tel" id="phone" required>
                </div>
                <div class="form-group">
                    <label for="enrollNumber">Número de Matrícula:</label>
                    <input type="text" id="enrollNumber" required>
                </div>
                <div class="form-group">
                    <label for="dateOfAdmission">Fecha de Admisión:</label>
                    <input type="date" id="dateOfAdmission" required>
                </div>

                <button type="submit" class="btn btn-success">Guardar Usuario</button>
                <button type="button" class="btn btn-secondary cancel-button">Cancelar</button>
            </form>
        </div>
    </div>
`;

// Función para renderizar una vista específica
export const renderView = (viewName) => {
    // Es crucial limpiar listeners si se reemplaza todo el HTML
    // Para simplificar, simplemente reemplazamos y re-adjuntamos en main.js
    appRoot.innerHTML = ''; // Limpia el contenido actual

    let viewContent = '';
    let bodyClass = '';

    switch (viewName) {
        case 'login':
            viewContent = loginView;
            bodyClass = 'auth-body';
            break;
        case 'register':
            viewContent = registerView;
            bodyClass = 'auth-body';
            break;
        case 'admin':
            viewContent = adminPanelView;
            bodyClass = ''; // O una clase específica para el admin panel si la necesitas
            break;
        default:
            console.error('Vista no reconocida:', viewName);
            viewContent = loginView;
            bodyClass = 'auth-body';
    }
    appRoot.innerHTML = viewContent;
    // Aplicar la clase al body para los estilos globales (ej. centrado de auth)
    document.body.className = bodyClass;
};