/**
 * mmConfirm - Biblioteca minimalista para diálogos de confirmación
 * v1.0.0
 */
(function() {
    // Prefijo único para evitar conflictos
    const PREFIX = 'mm-confirm-';
    
    // Configuraciones predeterminadas
    const defaults = {
        title: 'Confirmación',
        message: '¿Estás seguro de que deseas continuar con esta acción?',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'default', // 'default', 'success', 'danger', 'warning'
        allowOutsideClose: false,
        darkMode: false,
        onConfirm: null,
        onCancel: null,
        onClose: null
    };
    
    // Estilos CSS dinámicos
    const mmConfirmStyles = `
    /* Estilos básicos */
    .${PREFIX}overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
        backdrop-filter: blur(5px);
    }
    
    .${PREFIX}overlay.show {
        opacity: 1;
        visibility: visible;
    }
    
    .${PREFIX}dialog {
        width: 90%;
        max-width: 360px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        transform: translateY(30px) scale(0.95);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        overflow: hidden;
    }
    
    /* Modo oscuro */
    .${PREFIX}dialog.${PREFIX}dark-mode {
        background-color: #222;
        box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    }
    
    .${PREFIX}overlay.show .${PREFIX}dialog {
        transform: translateY(0) scale(1);
    }
    
    /* Animaciones de resaltado */
    @keyframes ${PREFIX}highlight-shake-default {
        0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        20% { transform: translateY(-5px) scale(1.02); box-shadow: 0 12px 40px rgba(33,150,243,0.25); }
        40% { transform: translateY(3px) scale(1.02); box-shadow: 0 12px 40px rgba(33,150,243,0.25); }
        60% { transform: translateY(-3px) scale(1.01); box-shadow: 0 10px 35px rgba(33,150,243,0.2); }
        80% { transform: translateY(2px) scale(1.01); box-shadow: 0 10px 35px rgba(33,150,243,0.2); }
    }
    
    @keyframes ${PREFIX}highlight-shake-success {
        0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        20% { transform: translateY(-5px) scale(1.02); box-shadow: 0 12px 40px rgba(76,175,80,0.25); }
        40% { transform: translateY(3px) scale(1.02); box-shadow: 0 12px 40px rgba(76,175,80,0.25); }
        60% { transform: translateY(-3px) scale(1.01); box-shadow: 0 10px 35px rgba(76,175,80,0.2); }
        80% { transform: translateY(2px) scale(1.01); box-shadow: 0 10px 35px rgba(76,175,80,0.2); }
    }
    
    @keyframes ${PREFIX}highlight-shake-danger {
        0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        20% { transform: translateY(-5px) scale(1.02); box-shadow: 0 12px 40px rgba(244,67,54,0.25); }
        40% { transform: translateY(3px) scale(1.02); box-shadow: 0 12px 40px rgba(244,67,54,0.25); }
        60% { transform: translateY(-3px) scale(1.01); box-shadow: 0 10px 35px rgba(244,67,54,0.2); }
        80% { transform: translateY(2px) scale(1.01); box-shadow: 0 10px 35px rgba(244,67,54,0.2); }
    }
    
    @keyframes ${PREFIX}highlight-shake-warning {
        0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        20% { transform: translateY(-5px) scale(1.02); box-shadow: 0 12px 40px rgba(255,152,0,0.25); }
        40% { transform: translateY(3px) scale(1.02); box-shadow: 0 12px 40px rgba(255,152,0,0.25); }
        60% { transform: translateY(-3px) scale(1.01); box-shadow: 0 10px 35px rgba(255,152,0,0.2); }
        80% { transform: translateY(2px) scale(1.01); box-shadow: 0 10px 35px rgba(255,152,0,0.2); }
    }
    
    .${PREFIX}dialog.${PREFIX}highlight-default {
        animation: ${PREFIX}highlight-shake-default 0.5s ease-in-out;
    }
    
    .${PREFIX}dialog.${PREFIX}highlight-success {
        animation: ${PREFIX}highlight-shake-success 0.5s ease-in-out;
    }
    
    .${PREFIX}dialog.${PREFIX}highlight-danger {
        animation: ${PREFIX}highlight-shake-danger 0.5s ease-in-out;
    }
    
    .${PREFIX}dialog.${PREFIX}highlight-warning {
        animation: ${PREFIX}highlight-shake-warning 0.5s ease-in-out;
    }
    
    /* Cabecera */
    .${PREFIX}header {
        padding: 20px 24px;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .${PREFIX}dialog.${PREFIX}dark-mode .${PREFIX}header {
        border-bottom: 1px solid #333;
    }
    
    .${PREFIX}icon {
        margin-right: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        color: white;
        flex-shrink: 0;
        transition: transform 0.3s ease;
    }
    
    .${PREFIX}overlay.show .${PREFIX}icon {
        transform: scale(1.05);
    }
    
    .${PREFIX}icon.default {
        background-color: #2196f3;
    }
    
    .${PREFIX}icon.success {
        background-color: #4caf50;
    }
    
    .${PREFIX}icon.danger {
        background-color: #f44336;
    }
    
    .${PREFIX}icon.warning {
        background-color: #ff9800;
    }
    
    .${PREFIX}title {
        color: #333;
        font-weight: 500;
        font-size: 17px;
        margin: 0;
        flex-grow: 1;
    }
    
    .${PREFIX}dialog.${PREFIX}dark-mode .${PREFIX}title {
        color: #f0f0f0;
    }
    
    /* Botón de cierre */
    .${PREFIX}close {
        position: absolute;
        right: 15px;
        top: 15px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
        color: #777;
        font-size: 20px;
        opacity: 0.6;
        transition: all 0.3s ease;
        font-family: auto;
    }
    
    .${PREFIX}dialog.${PREFIX}dark-mode .${PREFIX}close {
        color: #aaa;
    }
    
    .${PREFIX}close:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
        transform: rotate(90deg);
    }
    
    .${PREFIX}dialog.${PREFIX}dark-mode .${PREFIX}close:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
    
    /* Contenido */
    .${PREFIX}content {
        padding: 24px;
        font-size: 15px;
        line-height: 1.6;
        color: #555;
    }
    
    .${PREFIX}dialog.${PREFIX}dark-mode .${PREFIX}content {
        color: #d0d0d0;
    }
    
    /* Acciones */
    .${PREFIX}actions {
        display: flex;
        justify-content: flex-end;
        padding: 16px 24px 20px;
        gap: 12px;
    }
    
    /* Botones */
    .${PREFIX}btn {
        padding: 9px 18px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s ease;
        border: 1px solid #ddd;
        background-color: transparent;
        position: relative;
        overflow: hidden;
        letter-spacing: 0.3px;
    }
    
    .${PREFIX}btn::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.05);
        opacity: 0;
        transition: opacity 0.2s ease;
    }
    
    .${PREFIX}dialog.${PREFIX}dark-mode .${PREFIX}btn::after {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .${PREFIX}btn:hover::after {
        opacity: 1;
    }
    
    .${PREFIX}btn:active {
        transform: translateY(1px);
    }
    
    /* Botones de cancelar */
    .${PREFIX}btn-cancel {
        border-color: #e0e0e0;
        color: #666;
    }
    
    .${PREFIX}dialog.${PREFIX}dark-mode .${PREFIX}btn-cancel {
        border-color: #444;
        color: #ccc;
    }
    
    .${PREFIX}btn-cancel:hover {
        border-color: #ccc;
    }
    
    .${PREFIX}dialog.${PREFIX}dark-mode .${PREFIX}btn-cancel:hover {
        border-color: #666;
    }
    
    /* Botones por tipo */
    .${PREFIX}btn-default {
        border-color: #2196f3;
        color: #2196f3;
    }
    
    .${PREFIX}btn-default:hover {
        border-color: #1a88e0;
    }
    
    .${PREFIX}btn-success {
        border-color: #4caf50;
        color: #4caf50;
    }
    
    .${PREFIX}btn-success:hover {
        border-color: #43a047;
    }
    
    .${PREFIX}btn-danger {
        border-color: #f44336;
        color: #f44336;
    }
    
    .${PREFIX}btn-danger:hover {
        border-color: #e53935;
    }
    
    .${PREFIX}btn-warning {
        border-color: #ff9800;
        color: #ff9800;
    }
    
    .${PREFIX}btn-warning:hover {
        border-color: #fb8c00;
    }
    
    .${PREFIX}btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
    }
    `;
    
    // Crear elementos del diálogo
    function createDialogElements() {
        // Verificar si ya existe
        if (document.getElementById(`${PREFIX}overlay`)) {
            return;
        }
        
        // Crear el estilo
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = `${PREFIX}styles`;
        style.textContent = mmConfirmStyles;
        document.head.appendChild(style);
        
        // Crear estructura
        const overlay = document.createElement('div');
        overlay.id = `${PREFIX}overlay`;
        overlay.className = `${PREFIX}overlay`;
        
        const dialog = document.createElement('div');
        dialog.id = `${PREFIX}dialog`;
        dialog.className = `${PREFIX}dialog`;
        
        const header = document.createElement('div');
        header.className = `${PREFIX}header`;
        
        const icon = document.createElement('div');
        icon.id = `${PREFIX}icon`;
        icon.className = `${PREFIX}icon default`;
        icon.textContent = '?';
        
        const title = document.createElement('h3');
        title.id = `${PREFIX}title`;
        title.className = `${PREFIX}title`;
        title.textContent = 'Confirmación';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = `${PREFIX}close`;
        closeBtn.innerHTML = '&times;';
        closeBtn.id = `${PREFIX}close-button`;
        
        const content = document.createElement('div');
        content.id = `${PREFIX}message`;
        content.className = `${PREFIX}content`;
        content.textContent = '¿Estás seguro de que deseas continuar con esta acción?';
        
        const actions = document.createElement('div');
        actions.className = `${PREFIX}actions`;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.id = `${PREFIX}cancel-button`;
        cancelBtn.className = `${PREFIX}btn ${PREFIX}btn-cancel`;
        cancelBtn.textContent = 'Cancelar';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.id = `${PREFIX}confirm-button`;
        confirmBtn.className = `${PREFIX}btn ${PREFIX}btn-default`;
        confirmBtn.textContent = 'Confirmar';
        
        // Construir estructura DOM
        header.appendChild(icon);
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        actions.appendChild(cancelBtn);
        actions.appendChild(confirmBtn);
        
        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(actions);
        
        overlay.appendChild(dialog);
        
        // Agregar al body
        document.body.appendChild(overlay);
    }
    
    // Variables para los elementos DOM
    let elements = {
        overlay: null,
        dialog: null,
        message: null,
        confirmBtn: null,
        icon: null,
        title: null,
        cancelBtn: null,
        closeBtn: null
    };
    
    // Variables para opciones y estado actual
    let state = {
        confirmCallback: null,
        cancelCallback: null,
        closeCallback: null,
        allowOutsideClose: true,
        currentType: 'default'
    };
    
    // Inicializar elementos
    function initElements() {
        elements.overlay = document.getElementById(`${PREFIX}overlay`);
        elements.dialog = document.getElementById(`${PREFIX}dialog`);
        elements.message = document.getElementById(`${PREFIX}message`);
        elements.confirmBtn = document.getElementById(`${PREFIX}confirm-button`);
        elements.icon = document.getElementById(`${PREFIX}icon`);
        elements.title = document.getElementById(`${PREFIX}title`);
        elements.cancelBtn = document.getElementById(`${PREFIX}cancel-button`);
        elements.closeBtn = document.getElementById(`${PREFIX}close-button`);
    }
    
    // Función para resaltar el diálogo cuando no se puede cerrar
    function highlightDialog(type) {
        // Remover cualquier clase highlight anterior
        elements.dialog.classList.remove(
            `${PREFIX}highlight-default`, 
            `${PREFIX}highlight-success`, 
            `${PREFIX}highlight-danger`, 
            `${PREFIX}highlight-warning`
        );
        
        // Aplicar la clase según el tipo
        elements.dialog.classList.add(`${PREFIX}highlight-${type}`);
        
        // Eliminar la clase después de completar la animación
        setTimeout(() => {
            elements.dialog.classList.remove(`${PREFIX}highlight-${type}`);
        }, 500);
    }
    
    // Manejar eventos de teclado
    function handleKeyPress(event) {
        if (event.key === 'Escape') {
            if (state.allowOutsideClose) {
                closeConfirm();
                if (typeof state.cancelCallback === 'function') {
                    state.cancelCallback();
                }
                if (typeof state.closeCallback === 'function') {
                    state.closeCallback();
                }
            } else {
                highlightDialog(state.currentType);
            }
        }
    }
    
    // Función para cerrar el diálogo
    function closeConfirm() {
        if (elements.overlay) {
            elements.overlay.classList.remove('show');
        }
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    // Configurar eventos y atributos del diálogo
    function setupDialogEvents() {
        // Configurar cierre al hacer clic en X
        elements.closeBtn.onclick = function() {
            closeConfirm();
            if (typeof state.cancelCallback === 'function') {
                state.cancelCallback();
            }
            if (typeof state.closeCallback === 'function') {
                state.closeCallback();
            }
        };
        
        // Configurar botón de cancelar
        elements.cancelBtn.onclick = function() {
            closeConfirm();
            if (typeof state.cancelCallback === 'function') {
                state.cancelCallback();
            }
            if (typeof state.closeCallback === 'function') {
                state.closeCallback();
            }
        };
        
        // Configurar cierre al hacer clic en el overlay
        elements.overlay.onclick = function(event) {
            if (event.target === elements.overlay) {
                if (!state.allowOutsideClose) {
                    highlightDialog(state.currentType);
                } else {
                    closeConfirm();
                    if (typeof state.cancelCallback === 'function') {
                        state.cancelCallback();
                    }
                    if (typeof state.closeCallback === 'function') {
                        state.closeCallback();
                    }
                }
            }
        };
    }
    
    // Manejar tema oscuro
    function applyDarkModeConfirm(isDarkMode) {
        // Verificar si existe 'darkMode' en localStorage
        const localStorageDarkMode = localStorage.getItem('darkMode');
        
        // Determinar el modo a aplicar: prioriza localStorage si existe, sino usa el parámetro
        const darkModeToApply = localStorageDarkMode !== null 
            ? localStorageDarkMode === 'true' 
            : isDarkMode;
        
        // Aplicar el modo oscuro según corresponda
        if (darkModeToApply) {
            elements.dialog.classList.add(`${PREFIX}dark-mode`);
        } else {
            elements.dialog.classList.remove(`${PREFIX}dark-mode`);
        }
    }
    
    // Función principal expuesta al usuario
    function showConfirm(options = {}) {
        // Mezclar opciones con valores predeterminados
        const settings = Object.assign({}, defaults, options);
        
        // Crear el diálogo si no existe
        if (!document.getElementById(`${PREFIX}overlay`)) {
            createDialogElements();
            initElements();
            setupDialogEvents();
        } else if (!elements.overlay) {
            // Si ya existe pero no tenemos referencias
            initElements();
            setupDialogEvents();
        }
        
        // Almacenar el tipo actual
        state.currentType = settings.type;
        
        // Configurar contenido
        elements.message.textContent = settings.message;
        elements.title.textContent = settings.title;
        
        // Configurar texto de botones
        elements.confirmBtn.textContent = settings.confirmText;
        elements.cancelBtn.textContent = settings.cancelText;
        
        // Configurar icono según el tipo
        elements.icon.className = `${PREFIX}icon ${settings.type}`;
        
        // Cambiar icono según el tipo
        switch (settings.type) {
            case 'success':
                elements.icon.innerHTML = '✓';
                break;
            case 'danger':
                elements.icon.innerHTML = '!';
                break;
            case 'warning':
                elements.icon.innerHTML = '⚠';
                break;
            default:
                elements.icon.innerHTML = '?';
        }
        
        // Configurar clase del botón según el tipo
        elements.confirmBtn.className = `${PREFIX}btn ${PREFIX}btn-${settings.type}`;
        
        // Configurar modo oscuro
        applyDarkModeConfirm(settings.darkMode);
        
        // Configurar si se permite cerrar haciendo clic fuera
        state.allowOutsideClose = settings.allowOutsideClose;
        
        // Almacenar callbacks
        state.confirmCallback = settings.onConfirm;
        state.cancelCallback = settings.onCancel;
        state.closeCallback = settings.onClose;
        
        // Mostrar el overlay
        setTimeout(() => {
            elements.overlay.classList.add('show');
        }, 10);
        
        // Configurar manejador para el botón de confirmación
        elements.confirmBtn.onclick = function() {
            closeConfirm();
            if (typeof state.confirmCallback === 'function') {
                state.confirmCallback();
            }
            if (typeof state.closeCallback === 'function') {
                state.closeCallback();
            }
        };
        
        // Configurar cierre al presionar ESC
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // API pública
    window.mmConfirm = {
        show: showConfirm,
        close: closeConfirm
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            createDialogElements();
            initElements();
            setupDialogEvents();
        });
    } else {
        createDialogElements();
        initElements();
        setupDialogEvents();
    }
})();
