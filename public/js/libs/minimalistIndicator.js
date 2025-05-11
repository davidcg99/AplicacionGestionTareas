
    /**
 * MinimalistIndicator - Una biblioteca ligera para mostrar indicadores de carga
 * 
 * @author TI
 * @version 1.0.0
 */
class MinimalistIndicator {
  constructor(optionsIndicator = {}) {
    // Opciones por defecto
    this.defaultsIndicator = {
      darkMode: false,
      appendTo: 'body',
      blurBackground: true,
      colorsIndicator: {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
      }
    };
    
    // Combinar opciones
    this.optionsIndicator = { ...this.defaultsIndicator, ...optionsIndicator };
    
    // Inicializar
    this.initIndicator();
  }
  
  /**
   * Inicializa la biblioteca
   */
  initIndicator() {
    // Inyectar estilos CSS
    this.injectStylesIndicator();
    
    // Crear contenedor de overlay
    this.createOverlayIndicator();
  }
  
  /**
   * Inyecta los estilos CSS en el documento
   */
  injectStylesIndicator() {
    // Crear elemento de estilo
    const styleIndicator = document.createElement('style');
    styleIndicator.id = 'minimalist-indicator-styles';
    
    // Definir estilos CSS
    const cssIndicator = `
      :root {
        --mi-success-color: ${this.optionsIndicator.colorsIndicator.success};
        --mi-error-color: ${this.optionsIndicator.colorsIndicator.error};
        --mi-warning-color: ${this.optionsIndicator.colorsIndicator.warning};
        --mi-info-color: ${this.optionsIndicator.colorsIndicator.info};
        --mi-info-color-dark: #58b5f8; /* Azul más brillante para modo oscuro */
        --mi-border-radius: 8px;
        --mi-shadow: 0 2px 10px rgba(0,0,0,0.08);
        --mi-dark-shadow: 0 5px 25px rgba(0,0,0,0.3);
        --mi-transition-speed: 0.3s;
        --mi-light-bg: rgba(255, 255, 255, 0.9);
        --mi-dark-bg: rgba(20, 20, 30, 0.85); /* Fondo oscuro más intenso */
        --mi-light-container: #ffffff;
        --mi-dark-container: #1e1e1e;
      }
      
      .mi-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--mi-light-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      
      .mi-loading-overlay.mi-active {
        opacity: 1;
        pointer-events: all;
      }
      
      .mi-loading-overlay.mi-blur {
        backdrop-filter: blur(3px);
      }
      
      .mi-loading-overlay.mi-dark-mode {
        background-color: var(--mi-dark-bg);
      }
      
      .mi-loading-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
        background-color: var(--mi-light-container);
        border-radius: var(--mi-border-radius);
        box-shadow: var(--mi-shadow);
      }
      
      .mi-loading-container.mi-dark-mode {
        background-color: var(--mi-dark-container);
        box-shadow: var(--mi-dark-shadow);
      }
      
      /* Spinner */
      .mi-loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 0, 0, 0.05);
        border-radius: 50%;
        border-top-color: var(--mi-info-color);
        animation: mi-spin 0.8s ease-out infinite;
        box-shadow: 0 0 10px rgba(33, 150, 243, 0.2);
      }
      
      .mi-loading-spinner.mi-dark-mode {
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--mi-info-color-dark); /* Spinner azul para modo oscuro */
        box-shadow: 0 0 15px rgba(88, 181, 248, 0.4); /* Sombra más visible */
      }
      
      /* Dots */
      .mi-loading-dots {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 20px 30px;
      }
      
      .mi-loading-dots .mi-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        opacity: 0.6;
        animation: mi-pulse-bounce 1.4s ease-in-out infinite;
      }
      
      .mi-loading-dots .mi-dot:nth-child(1) {
        background-color: var(--mi-error-color);
        animation-delay: 0s;
      }
      
      .mi-loading-dots .mi-dot:nth-child(2) {
        background-color: var(--mi-warning-color);
        animation-delay: 0.2s;
      }
      
      .mi-loading-dots .mi-dot:nth-child(3) {
        background-color: var(--mi-info-color);
        animation-delay: 0.4s;
      }
      
      .mi-loading-dots .mi-dot:nth-child(4) {
        background-color: var(--mi-success-color);
        animation-delay: 0.6s;
      }
      
      /* Para modo oscuro, hacemos los puntos más brillantes */
      .mi-loading-dots.mi-dark-mode .mi-dot:nth-child(3) {
        background-color: var(--mi-info-color-dark);
      }
      
      /* Bar */
      .mi-loading-bar {
        width: 200px;
        height: 4px;
        background-color: rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        margin: 25px;
      }
      
      .mi-loading-bar.mi-dark-mode {
        background-color: rgba(255, 255, 255, 0.15);
      }
      
      .mi-loading-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 30%;
        background: linear-gradient(90deg, var(--mi-info-color), var(--mi-success-color));
        border-radius: 4px;
        animation: mi-loading-bar 1.5s ease-in-out infinite;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
      }
      
      .mi-loading-bar.mi-dark-mode::after {
        background: linear-gradient(90deg, var(--mi-info-color-dark), var(--mi-success-color));
        box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
      }
      
      /* Text */
      .mi-loading-text {
        margin-top: 15px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        color: #333;
        text-align: center;
      }
      
      .mi-loading-text.mi-dark-mode {
        color: #e0e0e0;
      }
      
      /* Animaciones */
      @keyframes mi-spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes mi-pulse-bounce {
        0%, 100% { transform: translateY(0) scale(0.8); opacity: 0.6; }
        50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
      }
      
      @keyframes mi-loading-bar {
        0% { left: -30%; width: 30%; }
        50% { width: 40%; }
        100% { left: 100%; width: 30%; }
      }
    `;
    
    // Agregar CSS al elemento de estilo
    styleIndicator.textContent = cssIndicator;
    
    // Insertar en el head
    document.head.appendChild(styleIndicator);
  }
  
  /**
   * Crea el contenedor de overlay
   */
  createOverlayIndicator() {
    // Verificar si ya existe el overlay
    if (document.getElementById('mi-loading-overlay')) {
      return;
    }
    
    // Crear elemento de overlay
    this.overlayIndicator = document.createElement('div');
    this.overlayIndicator.id = 'mi-loading-overlay';
    this.overlayIndicator.className = 'mi-loading-overlay';
    
    // Aplicar modo oscuro si está configurado
    if (this.optionsIndicator.darkMode) {
      this.overlayIndicator.classList.add('mi-dark-mode');
    }
    
    // Aplicar efecto de desenfoque si está configurado
    if (this.optionsIndicator.blurBackground) {
      this.overlayIndicator.classList.add('mi-blur');
    }
    
    // Agregar al DOM
    const containerIndicator = document.querySelector(this.optionsIndicator.appendTo) || document.body;
    containerIndicator.appendChild(this.overlayIndicator);
  }
  
  /**
   * Muestra un indicador de carga
   * @param {string} typeIndicator - Tipo de indicador (spinner, dots, bar)
   * @param {Object} optionsIndicator - Opciones adicionales
   */
  showIndicator(typeIndicator = 'spinner', optionsIndicator = {}) {
    // Opciones por defecto
    const defaultsIndicator = {
      text: '',
      darkMode: this.optionsIndicator.darkMode
    };
    
    // Combinar opciones
    const configIndicator = { ...defaultsIndicator, ...optionsIndicator };
    
    // Limpiar el overlay
    this.overlayIndicator.innerHTML = '';
    
    // Crear el contenedor de carga
    const loadingContainerIndicator = document.createElement('div');
    loadingContainerIndicator.className = 'mi-loading-container';
    
    // Aplicar modo oscuro si está configurado
    if (configIndicator.darkMode) {
      loadingContainerIndicator.classList.add('mi-dark-mode');
    }
    
    // Crear el indicador de carga según el tipo
    switch(typeIndicator) {
      case 'spinner':
        const spinnerIndicator = document.createElement('div');
        spinnerIndicator.className = 'mi-loading-spinner';
        if (configIndicator.darkMode) spinnerIndicator.classList.add('mi-dark-mode');
        loadingContainerIndicator.appendChild(spinnerIndicator);
        break;
        
      case 'dots':
        const dotsIndicator = document.createElement('div');
        dotsIndicator.className = 'mi-loading-dots';
        if (configIndicator.darkMode) dotsIndicator.classList.add('mi-dark-mode');
        for (let i = 0; i < 4; i++) {
          const dotIndicator = document.createElement('div');
          dotIndicator.className = 'mi-dot';
          dotsIndicator.appendChild(dotIndicator);
        }
        loadingContainerIndicator.appendChild(dotsIndicator);
        break;
        
      case 'bar':
        const barIndicator = document.createElement('div');
        barIndicator.className = 'mi-loading-bar';
        if (configIndicator.darkMode) barIndicator.classList.add('mi-dark-mode');
        loadingContainerIndicator.appendChild(barIndicator);
        break;
        
      default:
        const defaultSpinnerIndicator = document.createElement('div');
        defaultSpinnerIndicator.className = 'mi-loading-spinner';
        if (configIndicator.darkMode) defaultSpinnerIndicator.classList.add('mi-dark-mode');
        loadingContainerIndicator.appendChild(defaultSpinnerIndicator);
    }
    
    // Agregar texto si se proporcionó
    if (configIndicator.text) {
      const textElementIndicator = document.createElement('div');
      textElementIndicator.className = 'mi-loading-text';
      if (configIndicator.darkMode) textElementIndicator.classList.add('mi-dark-mode');
      textElementIndicator.textContent = configIndicator.text;
      loadingContainerIndicator.appendChild(textElementIndicator);
    }
    
    // Agregar al overlay
    this.overlayIndicator.appendChild(loadingContainerIndicator);
    
    // Mostrar overlay
    this.overlayIndicator.classList.add('mi-active');
    
    return this;
  }
  
  /**
   * Oculta el indicador de carga
   */
  hideIndicator() {
    this.overlayIndicator.classList.remove('mi-active');
    
    // Limpiar el contenido después de la transición
    setTimeout(() => {
      this.overlayIndicator.innerHTML = '';
    }, 300);
    
    return this;
  }
  
  /**
   * Actualiza las opciones de la biblioteca
   * @param {Object} optionsIndicator - Nuevas opciones
   */
  updateOptionsIndicator(optionsIndicator = {}) {
    this.optionsIndicator = { ...this.optionsIndicator, ...optionsIndicator };
    
    // Actualizar modo oscuro
    if (optionsIndicator.darkMode !== undefined) {
      if (optionsIndicator.darkMode) {
        this.overlayIndicator.classList.add('mi-dark-mode');
      } else {
        this.overlayIndicator.classList.remove('mi-dark-mode');
      }
    }
    
    // Actualizar efecto de desenfoque
    if (optionsIndicator.blurBackground !== undefined) {
      if (optionsIndicator.blurBackground) {
        this.overlayIndicator.classList.add('mi-blur');
      } else {
        this.overlayIndicator.classList.remove('mi-blur');
      }
    }
    
    return this;
  }
  
  /**
   * Activa o desactiva el modo oscuro
   * @param {boolean} enableIndicator - Activar o desactivar
   */
  toggleDarkModeIndicator(enableIndicator) {
    this.updateOptionsIndicator({ darkMode: enableIndicator });
    return this;
  }
}

// Exportar para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MinimalistIndicator;
}

