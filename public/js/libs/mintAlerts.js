        /**
 * MintAlerts - Biblioteca de alertas minimalistas con modo oscuro
 * v1.0.0
 * 
 * Una biblioteca ligera para mostrar notificaciones elegantes con soporte para temas claro y oscuro
 */

        (function(window) {
            'use strict';
            
            // Estilos CSS de la biblioteca
            const mintAlertsStyles = `
            /* Estilos base minimalistas */
            .mint_root {
                --mint-success-color: #4caf50;
                --mint-success-bg: #ffffff;
                --mint-error-color: #f44336;
                --mint-error-bg: #ffffff;
                --mint-warning-color: #ff9800;
                --mint-warning-bg: #ffffff;
                --mint-info-color: #2196f3;
                --mint-info-bg: #ffffff;
                --mint-border-radius: 8px;
                --mint-shadow: 0 2px 10px rgba(0,0,0,0.08);
                --mint-transition-speed: 0.3s;
                --mint-text-primary: #333333;
                --mint-text-secondary: #666666;
                --mint-background: #ffffff;
                --mint-border-color: #f0f0f0;
            }
            
            /* Tema oscuro */
            .mint_root.mint_dark-mode {
                --mint-success-color: #67c23a;
                --mint-success-bg: #1e2329;
                --mint-error-color: #ff5252;
                --mint-error-bg: #1e2329;
                --mint-warning-color: #e6a23c;
                --mint-warning-bg: #1e2329;
                --mint-info-color: #409eff;
                --mint-info-bg: #1e2329;
                --mint-shadow: 0 2px 10px rgba(0,0,0,0.25);
                --mint-text-primary: #e0e0e0;
                --mint-text-secondary: #aaaaaa;
                --mint-background: #1e2329;
                --mint-border-color: #2c3339;
            }
        
            /* Contenedor de alertas */
            .mint_alerts-container {
                position: fixed;
                width: 320px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            /* Posiciones del contenedor */
            .mint_alerts-container.mint_top-right {
                top: 20px;
                right: 20px;
            }
            
            .mint_alerts-container.mint_top-left {
                top: 20px;
                left: 20px;
            }
            
            .mint_alerts-container.mint_bottom-right {
                bottom: 20px;
                right: 20px;
            }
            
            .mint_alerts-container.mint_bottom-left {
                bottom: 20px;
                left: 20px;
            }
            
            /* Estilo de alertas - Diseño minimalista */
            .mint_alert {
                display: flex;
                align-items: center;
                padding: 14px 18px;
                border-radius: var(--mint-border-radius);
                box-shadow: var(--mint-shadow);
                background-color: var(--mint-background);
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                            opacity 0.3s ease, 
                            box-shadow 0.3s ease;
                position: relative;
                overflow: hidden;
                border-left: 4px solid transparent;
            }
            
            .mint_alert:hover {
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            }
            
            .mint_alert.mint_show {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            /* Tipos de alertas con bordes de colores */
            .mint_alert.mint_alert-success {
                border-left-color: var(--mint-success-color);
            }
            
            .mint_alert.mint_alert-error {
                border-left-color: var(--mint-error-color);
            }
            
            .mint_alert.mint_alert-warning {
                border-left-color: var(--mint-warning-color);
            }
            
            .mint_alert.mint_alert-info {
                border-left-color: var(--mint-info-color);
            }
            
            /* Componentes de las alertas */
            .mint_alert-icon {
                margin-right: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 15px;
                flex-shrink: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                color: white;
                animation: mint_pulse-soft 2s infinite;
            }
            
            .mint_alert-success .mint_alert-icon {
                background-color: var(--mint-success-color);
            }
            
            .mint_alert-error .mint_alert-icon {
                background-color: var(--mint-error-color);
            }
            
            .mint_alert-warning .mint_alert-icon {
                background-color: var(--mint-warning-color);
            }
            
            .mint_alert-info .mint_alert-icon {
                background-color: var(--mint-info-color);
            }
            
            .mint_alert-content {
                flex: 1;
            }
            
            .mint_alert-title {
                font-weight: 600;
                margin-bottom: 4px;
                font-size: 15px;
                letter-spacing: 0.2px;
                color: var(--mint-text-primary);
            }
            
            .mint_alert-success .mint_alert-title {
                color: var(--mint-success-color);
            }
            
            .mint_alert-error .mint_alert-title {
                color: var(--mint-error-color);
            }
            
            .mint_alert-warning .mint_alert-title {
                color: var(--mint-warning-color);
            }
            
            .mint_alert-info .mint_alert-title {
                color: var(--mint-info-color);
            }
            
            .mint_alert-message {
                font-size: 13px;
                line-height: 1.5;
                margin: 0;
                color: var(--mint-text-secondary);
            }
            
            /* Corrección para el botón de cierre */
            .mint_alert-close {
                cursor: pointer;
                opacity: 0.5;
                transition: all 0.2s;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                margin-left: 8px;
                color: var(--mint-text-secondary);
                position: relative;
                font-size: 0;
            }
            
            .mint_alert-close:hover {
                opacity: 1;
                background-color: rgba(128, 128, 128, 0.1);
                transform: rotate(90deg);
            }
            
            /* Crear una X con pseudoelementos para mejor alineación */
            .mint_alert-close::before,
            .mint_alert-close::after {
                content: '';
                position: absolute;
                width: 12px;
                height: 2px;
                background-color: var(--mint-text-secondary);
                top: 50%;
                left: 50%;
            }
            
            .mint_alert-close::before {
                transform: translate(-50%, -50%) rotate(45deg);
            }
            
            .mint_alert-close::after {
                transform: translate(-50%, -50%) rotate(-45deg);
            }
            
            /* Barra de progreso con animación mejorada */
            .mint_progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                width: 100%;
                background-color: rgba(128, 128, 128, 0.1);
                overflow: hidden;
            }
            
            .mint_progress-bar-fill {
                height: 100%;
                width: 100%;
                transform: scaleX(1);
                transform-origin: left;
                transition: transform linear;
            }
            
            .mint_alert-success .mint_progress-bar-fill {
                background-color: var(--mint-success-color);
            }
            
            .mint_alert-error .mint_progress-bar-fill {
                background-color: var(--mint-error-color);
            }
            
            .mint_alert-warning .mint_progress-bar-fill {
                background-color: var(--mint-warning-color);
            }
            
            .mint_alert-info .mint_progress-bar-fill {
                background-color: var(--mint-info-color);
            }
            
            /* Animaciones */
            @keyframes mint_pulse-soft {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            /* Responsive */
            @media (max-width: 576px) {
                .mint_alerts-container {
                    width: calc(100% - 30px);
                }
            }`;
            
            // Objeto principal de la biblioteca
            const MintAlerts = function() {
                // Variables privadas
                let activeAlerts = {};
                let alertCounter = 0;
                let alertsContainer;
                let initialized = false;
                let currentTheme = 'light';
                
                // Crear ID único para el contenedor
                const containerId = 'mint_alerts_' + Math.random().toString(36).substr(2, 9);
                
                /**
                 * Inyecta los estilos CSS en el documento
                 */
                const injectStyles = () => {
                    if (!document.getElementById('mint-alerts-styles')) {
                        const styleElement = document.createElement('style');
                        styleElement.id = 'mint-alerts-styles';
                        styleElement.textContent = mintAlertsStyles;
                        document.head.appendChild(styleElement);
                    }
                };
                
                /**
                 * Inicializa el sistema de alertas y crea dinámicamente el contenedor
                 * @param {Object} config - Configuración inicial
                 * @param {string} config.position - Posición (top-right, top-left, bottom-right, bottom-left)
                 * @param {boolean} config.darkMode - Activar modo oscuro
                 * @returns {Object} - El contenedor de alertas
                 */
                const init = (config = {}) => {
                    if (initialized) return alertsContainer;
                    
                    const position = config.position || 'top-right';
                    
                    // Inyectar estilos CSS
                    injectStyles();
                    
                    // Establecer el tema inicial
                    if (config.darkMode) {
                        currentTheme = 'dark';
                        document.body.classList.add('mint_root', 'mint_dark-mode');
                    } else {
                        document.body.classList.add('mint_root');
                    }
                    
                    // Crear el contenedor de alertas dinámicamente
                    alertsContainer = document.createElement('div');
                    alertsContainer.id = containerId;
                    alertsContainer.className = `mint_alerts-container mint_${position}`;
                    document.body.appendChild(alertsContainer);
                    
                    initialized = true;
                    return alertsContainer;
                };
                
                /**
                 * Cambia el tema entre claro y oscuro
                 * @param {boolean} darkMode - true para activar el modo oscuro, false para modo claro
                 */
                const setTheme = (darkMode) => {
                    if (darkMode) {
                        document.body.classList.add('mint_dark-mode');
                        currentTheme = 'dark';
                    } else {
                        document.body.classList.remove('mint_dark-mode');
                        currentTheme = 'light';
                    }
                };
                
                /**
                 * Obtiene el tema actual
                 * @returns {string} - 'light' o 'dark'
                 */
                const getTheme = () => {
                    return currentTheme;
                };
                
                /**
                 * Muestra una alerta
                 * @param {string} type - Tipo de alerta (success, error, warning, info)
                 * @param {string} title - Título de la alerta
                 * @param {string} message - Mensaje de la alerta
                 * @param {Object} options - Opciones de configuración
                 * @returns {string} - ID de la alerta creada
                 */
                const showAlert = (type, title, message, options = {}) => {
                    // Inicializar si no se ha hecho
                    if (!initialized) {
                        init({});
                    }
                    
                    // Opciones por defecto
                    const defaults = {
                        duration: 5000,
                        autoClose: true,
                        showProgress: true
                    };
                    
                    // Combinar opciones
                    const config = { ...defaults, ...options };
                    
                    // Crear ID único para esta alerta
                    const alertId = `mint_alert_${type}_${alertCounter++}`;
                    
                    // Crear elemento de alerta
                    const alertElement = document.createElement('div');
                    alertElement.className = `mint_alert mint_alert-${type}`;
                    alertElement.id = alertId;
                    
                    // Iconos basados en el tipo de alerta
                    let iconHTML = '';
                    switch(type) {
                        case 'success':
                            iconHTML = '✓';
                            break;
                        case 'error':
                            iconHTML = '✕';
                            break;
                        case 'warning':
                            iconHTML = '⚠';
                            break;
                        case 'info':
                            iconHTML = 'ℹ';
                            break;
                    }
                    
               // Primero, genera el HTML SIN onclick
                    alertElement.innerHTML = `
                        <div class="mint_alert-icon">${iconHTML}</div>
                        <div class="mint_alert-content">
                        <div class="mint_alert-title">${title}</div>
                        <p class="mint_alert-message">${message}</p>
                        </div>
                        <div class="mint_alert-close" data-alert-id="${alertId}"></div>
                        ${config.showProgress && config.autoClose ? '<div class="mint_progress-bar"><div class="mint_progress-bar-fill"></div></div>' : ''}
                        `;

                        // Después, le agregas el event listener
                    const closeButton = alertElement.querySelector('.mint_alert-close');
                    if (closeButton) {
                    closeButton.addEventListener('click', () => {
                        closeAlert(alertId);
                    });
                    }
                    
                    // Agregar al contenedor
                    alertsContainer.prepend(alertElement);
                    
                    // Mostrar alerta con efecto
                    setTimeout(() => {
                        alertElement.classList.add('mint_show');
                        
                        // Iniciar la animación de la barra de progreso
                        if (config.showProgress && config.autoClose) {
                            const progressBar = alertElement.querySelector('.mint_progress-bar-fill');
                            if (progressBar) {
                                progressBar.style.transition = `transform ${config.duration/1000}s linear`;
                                progressBar.style.transform = 'scaleX(0)';
                            }
                        }
                    }, 10);
                    
                    // Variables para manejar la pausa/continuación de la barra de progreso
                    const alertData = {
                        element: alertElement,
                        startTime: Date.now(),
                        duration: config.duration,
                        timeRemaining: config.duration,
                        isPaused: false,
                        currentProgress: 1, // Factor de escala actual (1 = inicio, 0 = final)
                        config: config
                    };
                    
                    // Auto cerrar si está habilitado
                    if (config.autoClose) {
                        alertData.timerId = setTimeout(() => {
                            closeAlert(alertId);
                            delete activeAlerts[alertId]; // Limpiar la referencia
                        }, config.duration);
                        
                        // Almacenar referencia
                        activeAlerts[alertId] = alertData;
                    }
                    
                    // Manejar interacciones con el mouse
                    setupMouseEvents(alertElement, alertId);
                    
                    return alertId;
                };
                
                /**
                 * Configura los eventos de ratón para pausar/reanudar la alerta
                 * @param {HTMLElement} alertElement - Elemento de alerta
                 * @param {string} alertId - ID de la alerta
                 */
                const setupMouseEvents = (alertElement, alertId) => {
                    // Detener la animación al pasar el mouse
                    alertElement.addEventListener('mouseenter', () => {
                        pauseAlert(alertId);
                    });
                    
                    // Reanudar la animación al quitar el mouse
                    alertElement.addEventListener('mouseleave', () => {
                        resumeAlert(alertId);
                    });
                    
                    // Detener temporalmente al hacer clic
                    alertElement.addEventListener('mousedown', () => {
                        pauseAlert(alertId);
                    });
                    
                    // Continuar al soltar el clic fuera del elemento
                    document.addEventListener('mouseup', function(event) {
                        // Verificar si el evento ocurre fuera del elemento de alerta
                        if (!alertElement.contains(event.target)) {
                            resumeAlert(alertId);
                        }
                    });
                };
                
                /**
                 * Pausa una alerta activa
                 * @param {string} alertId - ID de la alerta a pausar
                 */
                const pauseAlert = (alertId) => {
                    const alertData = activeAlerts[alertId];
                    if (!alertData || !alertData.config.autoClose || alertData.isPaused) return;
                    
                    // Cancelar el temporizador
                    clearTimeout(alertData.timerId);
                    
                    // Marcar como pausado
                    alertData.isPaused = true;
                    
                    // Calcular tiempo restante y progreso actual
                    const elapsedTime = Date.now() - alertData.startTime;
                    alertData.timeRemaining = Math.max(0, alertData.duration - elapsedTime);
                    
                    // Calcular el progreso actual (de 1 a 0)
                    alertData.currentProgress = alertData.timeRemaining / alertData.duration;
                    
                    // Pausar la barra de progreso
                    if (alertData.config.showProgress) {
                        const progressBar = alertData.element.querySelector('.mint_progress-bar-fill');
                        if (progressBar) {
                            // Obtener el estado actual de la transformación
                            const computedStyle = window.getComputedStyle(progressBar);
                            const matrix = new DOMMatrixReadOnly(computedStyle.getPropertyValue('transform'));
                            
                            // Extraer el valor de escala actual (scaleX)
                            const currentScaleX = matrix.m11;
                            alertData.currentProgress = currentScaleX;
                            
                            // Congelar la animación
                            progressBar.style.transition = 'none';
                            progressBar.style.transform = `scaleX(${currentScaleX})`;
                        }
                    }
                };
                
                /**
                 * Reanuda una alerta pausada
                 * @param {string} alertId - ID de la alerta a reanudar
                 */
                const resumeAlert = (alertId) => {
                    const alertData = activeAlerts[alertId];
                    if (!alertData || !alertData.config.autoClose || !alertData.isPaused) return;
                    
                    // Marcar como no pausado
                    alertData.isPaused = false;
                    
                    // Actualizar tiempo de inicio para la nueva cuenta regresiva
                    alertData.startTime = Date.now();
                    
                    // Reanudar la animación de la barra de progreso
                    if (alertData.config.showProgress) {
                        const progressBar = alertData.element.querySelector('.mint_progress-bar-fill');
                        if (progressBar) {
                            // Forzar un repintado
                            void progressBar.offsetWidth;
                            
                            // Calcular la duración restante basada en el progreso actual
                            const remainingDuration = alertData.timeRemaining;
                            
                            // Reanudar la animación desde el punto actual
                            progressBar.style.transition = `transform ${remainingDuration/1000}s linear`;
                            progressBar.style.transform = 'scaleX(0)';
                        }
                    }
                    
                    // Establecer un nuevo temporizador con el tiempo restante
                    alertData.timerId = setTimeout(() => {
                        closeAlert(alertId);
                        delete activeAlerts[alertId];
                    }, alertData.timeRemaining);
                };
                
                /**
                 * Cierra una alerta específica
                 * @param {string} alertId - ID de la alerta a cerrar
                 */
                const closeAlert = (alertId) => {
                    const alert = document.getElementById(alertId);
                    if (alert) {
                        // Cancelar el temporizador si existe
                        if (activeAlerts[alertId]) {
                            clearTimeout(activeAlerts[alertId].timerId);
                            delete activeAlerts[alertId];
                        }
                        
                        alert.classList.remove('mint_show');
                        setTimeout(() => {
                            if (alert.parentNode) {
                                alert.parentNode.removeChild(alert);
                            }
                        }, 300);
                    }
                };
                
                /**
                 * Cierra todas las alertas
                 */
                const closeAllAlerts = () => {
                    // Cancelar todos los temporizadores
                    Object.keys(activeAlerts).forEach(alertId => {
                        clearTimeout(activeAlerts[alertId].timerId);
                        closeAlert(alertId);
                    });
                    
                    // Limpiar el objeto activeAlerts
                    activeAlerts = {};
                };
                
                /**
                 * Establece la posición del contenedor de alertas
                 * @param {string} position - Posición (top-right, top-left, bottom-right, bottom-left)
                 */
                const setPosition = (position) => {
                    if (!initialized) {
                        init({ position });
                        return;
                    }
                    
                    // Quitar clases de posición anteriores
                    alertsContainer.classList.remove(
                        'mint_top-right', 
                        'mint_top-left', 
                        'mint_bottom-right', 
                        'mint_bottom-left'
                    );
                    
                    // Agregar la nueva clase de posición
                    alertsContainer.classList.add(`mint_${position}`);
                };
                
                // API pública
                return {
                    init,
                    setTheme,
                    getTheme,
                    showAlert,
                    closeAlert,
                    pauseAlert,
                    resumeAlert,
                    closeAllAlerts,
                    setPosition
                };
            };
            
            // Exportar la biblioteca como variable global
            window.mintAlertsLib = new MintAlerts();
            
        })(window);
        