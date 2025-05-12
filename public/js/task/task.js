
/**
 * Modelo de datos y estado de la aplicación
 */
const state = {
    tasks: [], // Array para almacenar todas las tareas
    currentFilter: 'all', // Filtro actual ('all', 'completed', 'pending')
    editingTaskId: null, // ID de la tarea en edición (null si no hay ninguna)
    modalVisible: false, // Estado del modal (visible o no)
    currentPage: 1, // Página actual
    tasksPerPage: 5, // Tareas por página
    tokenAuth: document.cookie.split('; ').find(row => row.startsWith('tokenAuth='))?.split('=')[1],
    userId: document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1]
};

/**
 * Elementos del DOM
 */
const DOM = {
    // Modal y formulario
    taskModal: document.getElementById('taskModal'),
    taskForm: document.getElementById('taskForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskDescription: document.getElementById('taskDescription'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    modalCloseBtns: document.querySelectorAll('.modal-close'),

    // Lista de tareas
    taskList: document.getElementById('taskList'),
    taskCounter: document.getElementById('taskCounter'),
    filterTasks: document.getElementById('filterTasks'),
    emptyState: document.getElementById('emptyState'),
    taskTable: document.getElementById('taskTable'),
    containerTable: document.getElementById('containerTableData'),
    pagination: document.getElementById('pagination'),

    // Alertas
    alertContainer: document.getElementById('alertContainer'),
    //logout 
    logout:  document.getElementById('logoutButton')
};

/**
 * Utilidades
 */
const utils = {
    // Genera un ID único para las tareas
    generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2),

    // Formatea una fecha a un string legible
    formatDate: (dateString) => {
        const date = new Date(dateString);
    
        return new Intl.DateTimeFormat('es-ES', {
            timeZone: 'America/Mexico_City',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // opcional: formato 24h
        }).format(date).replace(',', ' ');
    },

    // Muestra una alerta temporal
    showAlert: (message, type) => {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;

        // Icono basado en el tipo de alerta
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

        alert.appendChild(icon);

        const messageText = document.createTextNode(message);
        alert.appendChild(messageText);

        DOM.alertContainer.innerHTML = '';
        DOM.alertContainer.appendChild(alert);

        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            alert.style.transition = 'all 0.3s';

            setTimeout(() => {
                DOM.alertContainer.innerHTML = '';
            }, 300);
        }, 3000);
    }
};

/**
 * Funciones de gestión de tareas
 */
const taskManager = {
    addTask: async (title, description) => {
        try {

            const response = await fetch("/api/v1/task", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${state.tokenAuth}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    description: description || '',
                    userId: state.userId
                })
            });

            if (!response.ok) {
                throw new Error("No se pudo agregar la tarea");
            }

            const result = await response.json();

            // Verifica si el backend devuelve la tarea completa o solo algunos datos
            const newTask = result.data[0];
            newTask.updated_at = new Date().toISOString();
            newTask.created_at = new Date().toISOString();

            state.tasks.push(newTask);
            renderer.renderTasks();

            mintAlerts.showAlert('success', 'Información', 'Tarea agregada con éxito', {});

            //utils.showAlert('Tarea agregada con éxito', 'success');
            console.log(state.tasks);

        } catch (error) {

            mintAlerts.showAlert('error', 'error', error, {});

            return null;
        }
    },


    deleteTask: async (id) => {
        try {

            const response = await fetch(`/api/v1/task/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${state.tokenAuth}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("No se pudo eliminar la tarea");
            }

            // Si la petición fue exitosa, eliminarla del estado local
            state.tasks = state.tasks.filter(task => task.id !== id);

            // Ajustar la página actual si es necesario
            const filteredTasks = taskManager.filterTasksByStatus(state.currentFilter);
            const totalPages = Math.ceil(filteredTasks.length / state.tasksPerPage);
            if (state.currentPage > totalPages && totalPages > 0) {
                state.currentPage = totalPages;
            }

            renderer.renderTasks();
            mintAlerts.showAlert('warning', 'Advertencia', 'Tarea eliminada', {});

        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
            mintAlerts.showAlert('error', 'error', error.message, {});
        }
    },

    // Actualiza una tarea
    updateTask: async (id, updates) => {
        console.log(updates);
        const taskIndex = state.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            console.error("Tarea no encontrada");
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Ajusta según cómo almacenes el token

            const response = await fetch(`/api/v1/task/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${state.tokenAuth}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la tarea en el servidor");
            }

            const updatedTask = await response.json();
            delete updatedTask.data[0].created_at;
            console.log(updatedTask.data);
            // Actualizar estado local solo si el servidor respondió con éxito
            state.tasks[taskIndex] = {
                ...state.tasks[taskIndex],
                ...updatedTask.data[0],
                updated_at: new Date().toISOString()
            };

            renderer.renderTasks();

            mintAlerts.showAlert('success', 'Información', 'Tarea actualizada con éxito', {});


        } catch (error) {
            console.error("Error actualizando tarea:", error);
            mintAlerts.showAlert('error', 'error', 'Hubo un error al actualizar la tarea', {});

        }
    },


    // Cambia el estado de completado de una tarea
    toggleTaskStatus: async (id) => {
        const taskIndex = state.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) return;

        try {
            const task = state.tasks[taskIndex];
            const newStatus = !task.completed;

            const response = await fetch(`/api/v1/task/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${state.tokenAuth}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ completed: newStatus })
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar el estado de la tarea");
            }

            // Actualizar localmente solo si el backend respondió bien
            task.completed = newStatus;
            task.updated_at = new Date().toISOString();

            renderer.renderTasks();

            const statusMessage = task.completed
                ? 'Tarea marcada como completada'
                : 'Tarea marcada como pendiente';

            mintAlerts.showAlert('info', 'Información', statusMessage, {});


        } catch (error) {
            console.error("Error al cambiar el estado de la tarea:", error);
            mintAlerts.showAlert('error', 'error', 'Error al actualizar el estado de la tarea', {});
        }
    },


    // Filtra tareas por estado
    filterTasksByStatus: (status) => {
        if (status === 'all') {
            return state.tasks;
        } else if (status === 'completed') {
            return state.tasks.filter(task => task.completed);
        } else {
            return state.tasks.filter(task => !task.completed);
        }
    },

    // Inicia la edición de una tarea
    startEditing: (id) => {
        state.editingTaskId = id;
        renderer.renderTasks();
    },

    // Cancela la edición
    cancelEditing: () => {
        state.editingTaskId = null;
        renderer.renderTasks();
    },

    // Guarda los cambios de edición
    saveEditing: (id) => {
        const taskRow = document.getElementById(`task-${id}`);
        if (!taskRow) return;

        const titleInput = taskRow.querySelector('.edit-title');
        const descriptionInput = taskRow.querySelector('.edit-description');

        if (titleInput && titleInput.value.trim()) {
            taskManager.updateTask(id, {
                title: titleInput.value.trim(),
                description: descriptionInput ? descriptionInput.value.trim() : ''
            });
        } else {
            mintAlerts.showAlert('info', 'Información', "El título no puede estar vacío", {});
        }

        state.editingTaskId = null;
    },

    // Cambia la página actual
    changePage: (page) => {
        state.currentPage = page;
        renderer.renderTasks();
    }
};

/**
 * Funciones de renderizado
 */
const renderer = {
    // Renderiza la lista de tareas
    renderTasks: () => {
        const filteredTasks = taskManager.filterTasksByStatus(state.currentFilter);
        DOM.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            DOM.emptyState.style.display = 'block';
            DOM.taskTable.style.display = 'none';
            DOM.pagination.classList.add('hidden');
            DOM.containerTable.style.display = 'none';
        } else {
            DOM.emptyState.style.display = 'none';
            DOM.taskTable.style.display = 'table';
            DOM.containerTable.style.display = 'block';


            // Calcular tareas para la página actual
            const startIndex = (state.currentPage - 1) * state.tasksPerPage;
            const endIndex = state.tasksPerPage === Infinity ? filteredTasks.length : startIndex + state.tasksPerPage;
            const tasksToShow = filteredTasks.slice(startIndex, endIndex);

            tasksToShow.forEach((task, index) => {
                const row = document.createElement('tr');
                row.id = `task-${task.id}`;

                // Resalta la fila en edición
                if (state.editingTaskId === task.id) {
                    row.classList.add('edit-row');
                }

                // Celda de checkbox para completado
                const completedCell = document.createElement('td');
                completedCell.className = 'col-check';

                const checkboxContainer = document.createElement('label');
                checkboxContainer.className = 'custom-checkbox';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.addEventListener('change', () => taskManager.toggleTaskStatus(task.id));

                const checkmark = document.createElement('span');
                checkmark.className = 'checkmark';

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(checkmark);
                completedCell.appendChild(checkboxContainer);

                // Celda de título
                const titleCell = document.createElement('td');
                titleCell.className = 'col-title';
                if (state.editingTaskId === task.id) {
                    const titleInput = document.createElement('input');
                    titleInput.type = 'text';
                    titleInput.className = 'edit-input edit-title';
                    titleInput.value = task.title;
                    titleCell.appendChild(titleInput);
                } else {
                    titleCell.textContent = task.title;
                    if (task.completed) {
                        titleCell.classList.add('completed');
                    }
                }

                // Celda de descripción
                const descriptionCell = document.createElement('td');
                descriptionCell.className = 'col-desc';
                if (state.editingTaskId === task.id) {
                    const descriptionInput = document.createElement('input');
                    descriptionInput.type = 'text';
                    descriptionInput.className = 'edit-input edit-description';
                    descriptionInput.value = task.description || '';
                    descriptionCell.appendChild(descriptionInput);
                } else {
                    descriptionCell.textContent = task.description || 'Sin descripción';
                    if (task.completed) {
                        descriptionCell.classList.add('completed');
                    }
                }

                // Celda de fecha
                const dateCell = document.createElement('td');
                dateCell.className = 'col-date';
                dateCell.innerHTML = `<i class="far fa-clock"></i> ${utils.formatDate(task.created_at)}`;

                // Celda de fecha
                const dateCellupdate = document.createElement('td');
                dateCellupdate.className = 'col-date';
                dateCellupdate.innerHTML = `<i class="far fa-clock"></i> ${utils.formatDate(task.updated_at)}`;


                // Celda de acciones
                const actionsCell = document.createElement('td');
                actionsCell.className = 'col-actions';
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'task-actions';

                if (state.editingTaskId === task.id) {
                    // Botones de edición
                    const saveButton = document.createElement('button');
                    saveButton.innerHTML = '<i class="fas fa-save"></i> Guardar';
                    saveButton.className = 'btn-success';
                    saveButton.addEventListener('click', () => taskManager.saveEditing(task.id));

                    const cancelButton = document.createElement('button');
                    cancelButton.innerHTML = '<i class="fas fa-times"></i> Cancelar';
                    cancelButton.className = 'btn-danger';
                    cancelButton.addEventListener('click', taskManager.cancelEditing);

                    actionsContainer.appendChild(saveButton);
                    actionsContainer.appendChild(cancelButton);
                } else {
                    // Botones normales
                    const editButton = document.createElement('button');
                    editButton.innerHTML = '<i class="fas fa-edit"></i> Editar';
                    editButton.className = 'btn-warning';
                    editButton.addEventListener('click', () => taskManager.startEditing(task.id));

                    const deleteButton = document.createElement('button');
                    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Eliminar';
                    deleteButton.className = 'btn-danger';
                    deleteButton.addEventListener('click', () => {

                        mmConfirm.show({
                            type: 'warning',
                            title: 'Eliminación de registro',
                            message: '¿Estás seguro de que deseas realizar esta acción?',
                            confirmText: 'Sí, seguro',
                            cancelText: 'Cancelar',
                            onConfirm: () => { taskManager.deleteTask(task.id) }
                        });

                    });

                    actionsContainer.appendChild(editButton);
                    actionsContainer.appendChild(deleteButton);
                }

                actionsCell.appendChild(actionsContainer);

                // Añadir celdas a la fila
                row.appendChild(completedCell);
                row.appendChild(titleCell);
                row.appendChild(descriptionCell);
                row.appendChild(dateCell);
                row.appendChild(dateCellupdate);
                row.appendChild(actionsCell);

                DOM.taskList.appendChild(row);
            });

            // Renderizar paginación
            renderer.renderPagination(filteredTasks.length);
        }

        // Actualizar contador de tareas
        DOM.taskCounter.textContent = state.tasks.length;
    },

    // Renderiza la paginación
    renderPagination: (totalTasks) => {
        // Si estamos en modo "Ver todos", ajustar el cálculo de totalPages
        const totalPages = state.tasksPerPage === Infinity ? 1 : Math.ceil(totalTasks / state.tasksPerPage);

        DOM.pagination.innerHTML = '';
        DOM.pagination.classList.remove('hidden');

        // Si solo hay una página y no estamos en modo "Ver todos", ocultar paginación
        if (totalPages <= 1 && state.tasksPerPage !== Infinity) {
            DOM.pagination.classList.add('hidden');
            return;
        }

        // Botón Anterior (solo visible cuando no estamos en modo "Ver todos")
        if (state.tasksPerPage !== Infinity) {
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.disabled = state.currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (state.currentPage > 1) {
                    taskManager.changePage(state.currentPage - 1);
                }
            });
            DOM.pagination.appendChild(prevButton);

            // Botones de páginas
            const maxVisiblePages = 5;
            let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            // Ajustar si estamos cerca del final
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            // Mostrar primera página si no está visible
            if (startPage > 1) {
                const firstPageButton = document.createElement('button');
                firstPageButton.textContent = '1';
                firstPageButton.addEventListener('click', () => taskManager.changePage(1));
                DOM.pagination.appendChild(firstPageButton);

                if (startPage > 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    DOM.pagination.appendChild(ellipsis);
                }
            }

            // Botones de páginas numeradas
            for (let i = startPage; i <= endPage; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                if (i === state.currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.addEventListener('click', () => taskManager.changePage(i));
                DOM.pagination.appendChild(pageButton);
            }

            // Mostrar última página si no está visible
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    DOM.pagination.appendChild(ellipsis);
                }

                const lastPageButton = document.createElement('button');
                lastPageButton.textContent = totalPages;
                lastPageButton.addEventListener('click', () => taskManager.changePage(totalPages));
                DOM.pagination.appendChild(lastPageButton);
            }

            // Botón Siguiente
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.disabled = state.currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (state.currentPage < totalPages) {
                    taskManager.changePage(state.currentPage + 1);
                }
            });
            DOM.pagination.appendChild(nextButton);
        }

        // Botón Ver Todos (siempre visible)
        const viewAllButton = document.createElement('button');

        if (state.tasksPerPage === Infinity) {
            viewAllButton.innerHTML = '<i class="fas fa-th-list"></i> Mostrar Paginado';
            viewAllButton.classList.add('active');
        } else {
            viewAllButton.innerHTML = '<i class="fas fa-list"></i> Ver Todos';
        }

        viewAllButton.style.marginLeft = '10px';

        viewAllButton.addEventListener('click', () => {
            if (state.tasksPerPage === Infinity) {
                // Volver a la paginación normal
                state.tasksPerPage = 5;
            } else {
                // Mostrar todos
                state.tasksPerPage = Infinity;
            }
            state.currentPage = 1;
            renderer.renderTasks();
        });
        DOM.pagination.appendChild(viewAllButton);
    },
    // Muestra u oculta el modal
    toggleModal: (show) => {
        state.modalVisible = show;
        if (show) {
            DOM.taskModal.classList.add('show');
            DOM.taskTitle.focus();
        } else {
            DOM.taskModal.classList.remove('show');
            DOM.taskForm.reset();
        }
    }
};

/**
 * Manejadores de eventos
 */
const eventHandlers = {
    // Inicializa todos los event listeners
    init: () => {
        // Formulario para agregar tareas
        DOM.taskForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const title = DOM.taskTitle.value.trim();
            const description = DOM.taskDescription.value.trim();

            if (title) {
                taskManager.addTask(title, description);
                renderer.toggleModal(false);
            } else {

                mintAlerts.showAlert('info', 'Información', "Por favor, ingresa un título para la tarea", {});

            }
        });

        // Filtro de tareas
        DOM.filterTasks.addEventListener('change', function () {
            state.currentFilter = this.value;
            state.currentPage = 1; // Resetear a la primera página al cambiar filtro
            renderer.renderTasks();
        });

        // Botón para abrir el modal
        DOM.addTaskBtn.addEventListener('click', () => renderer.toggleModal(true));

        // Botones para cerrar el modal
        DOM.modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => renderer.toggleModal(false));
        });

        // Cerrar modal haciendo clic fuera del contenido
        DOM.taskModal.addEventListener('click', (e) => {
            if (e.target === DOM.taskModal) {
                renderer.toggleModal(false);
            }
        });

        DOM.logout.addEventListener('click', () => {
            // Redirige al endpoint de logout
            window.location.href = '/logout';
        });

    }
};

/**
 * Inicialización de la aplicación
 */
const app = {
    loadTasks: async () => {
        if (state.tasks.length === 0) {
            try {

                const response = await fetch("/api/v1/task/?userId=" + state.userId, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${state.tokenAuth}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las tareas");
                }

                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    console.log(result.data);
                    state.tasks = result.data;
                } else {

                    mintAlerts.showAlert('error', 'error', "Formato de respuesta inválido", {});

                    console.error("Formato de respuesta inválido:", result);
                }

            } catch (error) {
                mintAlerts.showAlert('error', 'error', "Error al cargar las tareas", {});

                console.error("Error cargando tareas:", error);
            }
        }
    },
    // Inicia la aplicación
    init: async () => {
        await eventHandlers.init();
        await app.loadTasks();
        await renderer.renderTasks();
    }
};

// Iniciar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', app.init);
