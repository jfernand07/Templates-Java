// Asegúrate de que los IDs de los elementos DOM existen en la vista que se está renderizando.
// Si esta vista no está cargada, estos selectores devolverán null.
const usersTableBody = () => document.querySelector('#users-table tbody');
const userModal = () => document.getElementById('user-modal');
const modalTitle = () => document.getElementById('modal-title');
const userForm = () => document.getElementById('user-form');
const userIdInput = () => document.getElementById('user-id');
const nameInput = () => document.getElementById('name');
const emailInput = () => document.getElementById('email');
const phoneInput = () => document.getElementById('phone');
const enrollNumberInput = () => document.getElementById('enrollNumber');
const dateOfAdmissionInput = () => document.getElementById('dateOfAdmission');


export const renderUsers = (users, onEdit, onDelete) => {
    const tableBody = usersTableBody();
    if (!tableBody) return; // Salir si el elemento no existe (ej. no estamos en la vista admin)

    tableBody.innerHTML = ''; // Limpiar la tabla antes de renderizar
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay usuarios para mostrar.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.enrollNumber}</td>
            <td>${user.dateOfAdmission}</td>
            <td class="actions">
                <button class="btn btn-info edit-btn" data-id="${user.id}">Editar</button>
                <button class="btn btn-danger delete-btn" data-id="${user.id}">Eliminar</button>
            </td>
        `;
    });

    // Añadir event listeners para los botones de edición y eliminación
    tableBody.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => onEdit(e.target.dataset.id));
    });

    tableBody.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => onDelete(e.target.dataset.id));
    });
};

export const openModal = (type = 'create', userData = {}) => {
    const modal = userModal();
    const title = modalTitle();
    const form = userForm();
    const userId = userIdInput();
    const name = nameInput();
    const email = emailInput();
    const phone = phoneInput();
    const enrollNumber = enrollNumberInput();
    const dateOfAdmission = dateOfAdmissionInput();

    if (!modal || !title || !form) return; // Salir si los elementos no existen

    modal.style.display = 'flex'; // Usar flex para centrado
    if (type === 'create') {
        title.textContent = 'Agregar Usuario';
        form.reset(); // Limpiar formulario
        userId.value = '';
    } else { // type === 'edit'
        title.textContent = 'Editar Usuario';
        userId.value = userData.id;
        name.value = userData.name;
        email.value = userData.email;
        phone.value = userData.phone;
        enrollNumber.value = userData.enrollNumber;
        // Formatear la fecha para el input type="date" (AAAA-MM-DD)
        const dateParts = userData.dateOfAdmission.split('-'); // "08-Dec-2021"
        const monthMap = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
            'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        const formattedDate = `${dateParts[2]}-${monthMap[dateParts[1]]}-${dateParts[0]}`;
        dateOfAdmission.value = formattedDate;
    }
};

export const closeModal = () => {
    const modal = userModal();
    if (modal) {
        modal.style.display = 'none';
    }
};

export const getUserFormData = () => {
    const dateInput = dateOfAdmissionInput();
    if (!dateInput) return {}; // Retornar vacío si no hay formulario

    const date = new Date(dateInput.value);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(/ /g, '-'); // "08-Dec-2021"

    return {
        id: userIdInput().value ? parseInt(userIdInput().value) : undefined, // ID solo si es edición
        name: nameInput().value,
        email: emailInput().value,
        phone: phoneInput().value,
        enrollNumber: enrollNumberInput().value,
        dateOfAdmission: formattedDate
    };
};

export const setupModalCloseListeners = () => {
    const closeBtn = document.querySelector('.close-button');
    const cancelBtn = document.querySelector('.cancel-button');
    const modal = userModal();

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                closeModal();
            }
        });
    }
};