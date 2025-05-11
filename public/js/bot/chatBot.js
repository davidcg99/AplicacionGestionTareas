// chatbot-flotante.js
class FloatingChatbot {
  constructor(config = {}) {
    // Configuración por defecto
    this.defaultConfig = {
      enableCircleEffect: true,
      showFloatingMessage: false,
      floatingMessageText: "¡Información Inmediata con IA aquí! 👉🏼",
      floatingMessageFont: "Helvetica Neue, Helvetica, Arial, sans-serif",
      floatingMessageSize: "15px",
      floatingMessageColor: "#747474",
      floatingButtonEffect: true,
      companyName: "autotraffic",
      chatbotName: "T-bot",
      primaryColor: "#f44336",
      darkMode: false,
      botAvatar: "/img/chatBot/botAvatar.png",
      userAvatar: "/img/chatBot/userAvatar.png",
      headerIconImg: "/img/chatBot/headerIcon.png",
      profileImageImg: "/img/chatBot/profileBot.png",
      welcomeMessage: `¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy? 👋`,
      typingText: `autotraffic está escribiendo...`,
      inputPlaceholder: "Escribe tu mensaje aquí...",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "h:mm a",
      showTodayLabel: true,
      showYesterdayLabel: true,
      showDayBeforeYesterdayLabel: true,
      showTimestampForNewDay: true,
      apiUrl: "",
      bearerToken: ""
    };

    // Combinar configuración personalizada con la predeterminada
    this.config = { ...this.defaultConfig, ...config };

    // Estado del chatbot
    this.isWaitingForResponse = false;
    this.scrollPosition = 0;
    this.isChatOpen = false;
    this.isAnimating = false;
    this.lastMessageDate = null;
    this.conversationGuid = localStorage.getItem('chatGuid') || this.generateGuid();

    localStorage.getItem('chatGuid') || localStorage.setItem('chatGuid', this.conversationGuid);
    // Inicializar el chatbot
    this.init();
  }

  // Método de inicialización
  init() {
    // Crear elementos del DOM
    this.createDOM();
    // Aplicar configuración
    this.applyConfig();
    // Configurar event listeners
    this.setupEventListeners();
    // Cargar historial o mostrar mensaje inicial
    this.loadInitialContent();
  }

  // Crear estructura HTML del chatbot
  createDOM() {
    // Crear contenedor principal
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="idbtnflotantediv">
          <div class="cotizacion-message">
            <div class="message-container-modal"></div>
            <button class="close-btn">×</button>
          </div>
        </div>

<button class="floating-button chat-toggle-button" id="chat-toggle" style="width: 48px; height: 48px; padding: 0; border: none; background: transparent; cursor: pointer;">
  <svg role="img" style="border-radius: 50%; fill: rgb(255, 255, 255);" viewBox="0 0 90 90" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0V0z" fill="none"></path>
    <path d="M33.57,31A4.58,4.58,0,0,0,29,35.57V58.3a1.94,1.94,0,0,0,3.32,1.38l3-3a.29.29,0,0,1,.21-.09H56.43A4.58,4.58,0,0,0,61,52V35.57A4.58,4.58,0,0,0,56.43,31Z"></path>
  </svg>
</button>

        <div class="chat-container" id="chat-container">
          <button id="scroll-to-bottom" class="scroll-to-bottom" title="Ir abajo">
            <i class="fas fa-chevron-down"></i>
          </button>
  
          <div class="confirm-dialog" id="confirm-dialog">
            <div class="confirm-content">
              <div class="confirm-title">Reiniciar conversación</div>
              <div class="confirm-message">¿Estás seguro de que deseas reiniciar la conversación? Se perderá todo el historial de este chat.</div>
              <div class="confirm-buttons">
                <button class="confirm-button cancel" id="cancel-reset">Cancelar</button>
                <button class="confirm-button confirm" id="confirm-reset">Reiniciar</button>
              </div>
            </div>
          </div>
  
          <div class="chat-header">
            <div class="header-title">
              <div class="header-icon">
                <img alt="Chatbot" id="header-icon-img" />
                <div class="header-icon-text">CHAT</div>
              </div>
              <span id="chatbot-name">Chatbot</span>
            </div>
            <div class="header-actions">
              <button class="header-button" id="refresh-button" title="Reiniciar chat">
                <i class="fas fa-sync-alt"></i>
              </button>
              <button class="header-button" id="close-button" title="Cerrar chat">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
  
          <div class="chat-messages" id="chat-messages">
            <div class="chat-profile" id="chat-profile">
              <div class="profile-image">
                <img alt="Chatbot" id="profile-image-img" />
              </div>
              <div class="profile-name" id="profile-name">Chatbot</div>
            </div>
            <div class="timestamp" id="welcome-timestamp"></div>
            <div class="message bot">
              <div class="message-avatar">
                <img alt="Chatbot" id="message-avatar-img" />
              </div>
              <div class="message-content" id="welcome-message">
                <div class="message-time" id="welcome-time"></div>
              </div>
            </div>
          </div>
  
          <div class="chat-input">
            <div class="input-wrapper">
              <textarea class="input-field" id="user-input" placeholder="¿En qué puedo ayudarte hoy?" rows="1"></textarea>
              <button class="send-button" id="send-button" title="Enviar mensaje">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
            <div class="waiting-overlay" id="waiting-overlay">
              <div class="waiting-text">
                <div class="pulse-dot"></div>
                Esperando respuesta...
              </div>
            </div>
          </div>
        </div>
      `;

    
    // Crear elemento style en el head
    const styleElement = document.createElement('style');
    styleElement.id = 'floating-chatbot-styles';
    styleElement.textContent = `
      .chat-container {
        --primary-color: ${this.config.primaryColor};
        --background-color: #ffffff;
        --text-color: #111;
        --message-user-bg: color-mix(in srgb, var(--primary-color), white 80%);
        --message-bot-bg: #f0f0f0;
        --scrollbar-thumb: color-mix(in srgb, var(--primary-color), white 20%);
        --input-focus-shadow: color-mix(in srgb, var(--primary-color), white 80%);
      }
  
      .chat-container.dark-mode {
        --background-color: #111;
        --text-color: #f0f0f0;
        --message-user-bg: color-mix(in srgb, var(--primary-color), black 30%);
        --message-bot-bg: #333;
        --primary-color: ${this.config.primaryColor};
        --scrollbar-thumb: color-mix(in srgb, var(--primary-color), black 20%);
        --input-focus-shadow: color-mix(in srgb, var(--primary-color), black 30%);
      }
  
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
      }
  
      body {
        background-color: #f5f5f5;
        height: 100vh;
        position: relative;
      }
  
      .chat-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 100%;
        max-width: 390px;
        height: 90%;
        border-radius: 35px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        background-color: var(--background-color);
        transition: all 0.3s ease;
        transform-origin: bottom right;
        z-index: 1000;
        display: none;
      }
  
      .chat-container.active {
        display: flex;
      }
  
      .chat-header {
        background-color: var(--background-color);
        color: var(--text-color);
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--message-bot-bg);
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
      }
  
      .header-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }
  
      .header-icon {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        overflow: hidden;
      }
  
      .header-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      .header-icon-text {
        display: none;
      }
  
      .dark-mode .user .message-content {
        color: white;
      }
  
      .header-actions {
        display: flex;
        gap: 10px;
        z-index: 2;
      }
  
      .header-button {
        background-color: rgba(255, 255, 255, 0.1);
        border: none;
        color: var(--text-color);
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  
      .header-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
  
      .header-button:active {
        transform: scale(0.95);
      }
  
      .header-button#refresh-button {
        color: var(--primary-color);
      }
  
      .header-button#close-button {
        color: #f44336;
      }
  
      .header-button i {
        font-size: 16px;
      }
  
      .chat-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        background-color: var(--background-color);
        transition: all 0.3s ease;
      }
  
      .profile-image {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10px;
      }
  
      .profile-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      .profile-name {
        color: var(--text-color);
        font-size: 18px;
        font-weight: bold;
      }
  
      .chat-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 15px;
        background-color: var(--background-color);
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-thumb) var(--background-color);
      }
  
      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }
  
      .chat-messages::-webkit-scrollbar-track {
        background: var(--background-color);
        border-radius: 10px;
      }
  
      .chat-messages::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 10px;
        transition: background 0.3s ease;
      }
  
      .chat-messages::-webkit-scrollbar-thumb:hover {
        background: var(--primary-color);
      }
  
      .timestamp {
        color: #777;
        text-align: center;
        font-size: 12px;
        margin: 15px 0;
        padding: 5px 10px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        align-self: center;
        display: inline-block;
      }
  
      .dark-mode .timestamp {
        color: #aaa;
        background-color: rgba(0, 0, 0, 0.2);
      }
  
      .message {
        display: flex;
        align-items: flex-end;
        gap: 10px;
        max-width: 80%;
        animation: fadeIn 0.3s ease;
      }
  
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
  
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
  
      .message.bot {
        align-self: flex-start;
      }
  
      .message.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }
  
      .message-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #f2f2f2;
        overflow: hidden;
        flex-shrink: 0;
        margin-bottom: 5px;
      }
  
      .message-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      .message-content {
        padding: 12px 15px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: inherit;
      }
  
      .message-time {
        font-size: 10px;
        color: #777;
        margin-top: 4px;
        text-align: right;
      }
  
      .dark-mode .message-time {
        color: #aaa;
      }
  
      .bot .message-content {
        background-color: var(--message-bot-bg);
        color: var(--text-color);
        border-bottom-left-radius: 5px;
        border-top-left-radius: 18px;
        border-top-right-radius: 18px;
        border-bottom-right-radius: 18px;
      }
  
      .user .message-content {
        background-color: var(--message-user-bg);
        color: black;
        border-bottom-right-radius: 5px;
        border-top-left-radius: 18px;
        border-top-right-radius: 18px;
        border-bottom-left-radius: 18px;
      }
  
      .message-content strong,
      .message-content b {
        font-weight: bold;
      }
  
      .message-content em,
      .message-content i {
        font-style: italic;
      }
  
      .message-content code {
        font-family: monospace;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 2px 4px;
        border-radius: 3px;
      }
  
      .dark-mode .message-content code {
        background-color: rgba(255, 255, 255, 0.1);
        color: #f0f0f0;
      }
  
      .message-content pre {
        font-family: monospace;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 8px;
        border-radius: 5px;
        overflow-x: auto;
        margin: 8px 0;
        white-space: pre-wrap;
      }
  
      .dark-mode .message-content pre {
        background-color: rgba(255, 255, 255, 0.1);
        color: #f0f0f0;
      }
  
      .message-content p {
        margin-bottom: 8px;
      }
  
      .message-content p:last-child {
        margin-bottom: 0;
      }
  
      .message-content ul,
      .message-content ol {
        padding-left: 20px;
        margin: 8px 0;
      }
  
      .dark-mode .message-content ul,
      .dark-mode .message-content ol {
        color: #f0f0f0;
      }
  
      .html-message {
        background-color: var(--message-bot-bg);
        padding: 3px 3px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
        color: var(--text-color);
        border-bottom-left-radius: 5px;
        border-top-left-radius: 18px;
        border-top-right-radius: 18px;
        border-bottom-right-radius: 18px;
        margin-bottom: 15px;
        animation: fadeIn 0.3s ease;
      }
  
      .html-message-time {
        font-size: 10px;
        color: #777;
        margin-top: 4px;
        text-align: right;
        padding-right: 10px;
      }
  
      .dark-mode .html-message-time {
        color: #aaa;
      }
  
      .dark-mode .html-message code,
      .dark-mode .html-message pre {
        background-color: rgba(255, 255, 255, 0.1);
        color: #f0f0f0;
      }
  
      .dark-mode .html-message ul,
      .dark-mode .html-message ol {
        color: #f0f0f0;
      }
  
      .dark-mode .html-message table {
        color: #f0f0f0;
        border-color: #555;
      }
  
      .dark-mode .html-message th {
        background-color: rgba(255, 255, 255, 0.1);
      }
  
      .dark-mode .html-message td {
        border-color: #444;
      }
  
      .chat-input {
        padding: 15px;
        background-color: var(--background-color);
        display: flex;
        align-items: center;
        gap: 10px;
        border-top: 1px solid var(--message-bot-bg);
        flex-shrink: 0;
        position: relative;
      }
  
      .input-wrapper {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
      }
  
      .input-field {
        width: 100%;
        background-color: var(--message-bot-bg);
        border: none;
        border-radius: 25px;
        padding: 12px 50px 12px 15px;
        color: var(--text-color);
        font-size: 16px;
        resize: none;
        min-height: 44px;
        max-height: 120px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--primary-color) #444;
      }
  
      .input-field::-webkit-scrollbar {
        width: 4px;
      }
  
      .input-field::-webkit-scrollbar-track {
        background: #444;
        border-radius: 10px;
      }
  
      .input-field::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 10px;
      }
  
      .input-field:focus {
        outline: none;
        box-shadow: 0 0 0 3px var(--input-focus-shadow);
      }
  
      .input-field.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
  
      .send-button {
        position: absolute;
        right: 7px;
        background-color: var(--primary-color);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        flex-shrink: 0;
        transition: transform 0.2s ease, background-color 0.2s ease;
      }
  
      .send-button:hover {
        transform: scale(1.05);
        background-color: var(--primary-color);
      }
  
      .send-button:active {
        transform: scale(0.95);
      }
  
      .send-button.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
  
      .typing-wrapper {
        background-color: var(--message-bot-bg);
        padding: 15px;
        border-radius: 18px;
        border-bottom-left-radius: 5px;
        position: relative;
        min-width: 100px;
      }
  
      .typing-wrapper::before {
        content: attr(data-typing-text);
        display: block;
        font-size: 11px;
        color: #aaa;
        margin-bottom: 8px;
      }
  
      .typing-indicator {
        display: flex;
        gap: 6px;
        align-items: center;
        justify-content: flex-start;
        height: 14px;
      }
  
      @keyframes typeWave {
  
        0%,
        100% {
          transform: translateY(0px);
        }
  
        50% {
          transform: translateY(-5px);
        }
      }
  
      .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(to bottom, var(--primary-color), var(--primary-color));
        animation: typeWave 1.2s infinite;
        box-shadow: 0 2px 4px rgba(40, 23, 18, 0.3);
      }
  
      .typing-dot:nth-child(1) {
        animation-delay: 0s;
      }
  
      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
  
      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
  
      .waiting-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 25px;
        z-index: 5;
        display: none;
        color: #f0f0f0;
      }
  
      .waiting-overlay.active {
        display: flex;
      }
  
      .waiting-text {
        color: white;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 8px 15px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
  
      .pulse-dot {
        width: 8px;
        height: 8px;
        background-color: var(--primary-color);
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      }
  
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          opacity: 0.7;
        }
  
        50% {
          transform: scale(1.05);
          opacity: 1;
        }
  
        100% {
          transform: scale(0.95);
          opacity: 0.7;
        }
      }
  
      .chat-toggle-button {
       border-color: #ffffff00;
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 999;
        font-size: 24px;
        transition: all 0.3s ease;
        opacity: 1;
        transform: scale(1);
      }
  
      .chat-toggle-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }
  
      .chat-toggle-button:active {
        transform: scale(0.95);
      }
  
      .chat-toggle-button.chat-open {
        bottom: 90px;
        transform: scale(0.8);
        opacity: 0.7;
      }
  
      .chat-toggle-button.chat-open:hover {
        opacity: 1;
        transform: scale(0.85);
      }
  
      @keyframes slideIn {
        from {
          transform: translateY(20px) scale(0.9);
          opacity: 0;
        }
  
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
  
      @keyframes slideOut {
        from {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
  
        to {
          transform: translateY(20px) scale(0.9);
          opacity: 0;
        }
      }
  
      .chat-container.active {
        animation: slideIn 0.3s forwards;
      }
  
      .chat-container.closing {
        animation: slideOut 0.3s forwards;
      }
  
      /* Modal de confirmación dentro del chat-container */
      .confirm-dialog {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
  
      .confirm-dialog.active {
        opacity: 1;
        visibility: visible;
      }
  
      .confirm-content {
        background-color: var(--background-color);
        padding: 25px;
        border-radius: 15px;
        max-width: 320px;
        width: 90%;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        transform: translateY(20px);
        transition: all 0.3s ease;
      }
  
      .confirm-dialog.active .confirm-content {
        transform: translateY(0);
      }
  
      .confirm-title {
        color: var(--text-color);
        font-size: 18px;
        margin-bottom: 15px;
      }
  
      .confirm-message {
        color: #aaa;
        font-size: 14px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
  
      .confirm-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
  
      .confirm-button {
        padding: 8px 15px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s ease;
      }
  
      .confirm-button.cancel {
        background-color: #444;
        color: white;
      }
  
      .confirm-button.confirm {
        background-color: #f44336;
        color: white;
      }
  
      .confirm-button:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
  
      .confirm-button:active {
        transform: translateY(0);
      }
  
      /* Estilos para el historial de conversación */
      .history-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: #aaa;
        font-size: 14px;
      }
  
      .history-loading-spinner {
        width: 30px;
        height: 30px;
        border: 3px solid rgba(255, 87, 34, 0.3);
        border-radius: 50%;
        border-top-color: var(--primary-color);
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 10px;
      }
  
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
  
      /* Scroll to bottom button */
      #scroll-to-bottom {
        position: absolute;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        background-color: color-mix(in srgb, var(--primary-color), white 30%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 2;
      }
  
      .dark-mode #scroll-to-bottom {
        background-color: color-mix(in srgb, var(--primary-color), black 30%);
      }
  
      #scroll-to-bottom.show {
        opacity: 1;
        visibility: visible;
      }
  
      #scroll-to-bottom i {
        font-size: 18px;
      }
  
      @media (min-width: 1200px) {
        .chat-container {
          height: 90%;
        }
      }
  
      @media (max-width: 991px) and (orientation: landscape) {
        .chat-container {
          height: 90%;
       
          width: 99%;
        }
      }
  
      @media (max-width: 767px) {
        .chat-container {
          width: calc(100% - 20px);
          max-width: 100%;
          height: 98%;
          bottom: 10px;
          right: 10px;
          left: 10px;
          border-radius: 15px;
        }
  
        .message {
          max-width: 90%;
        }
  
        .confirm-content {
          width: 85%;
        }
      }
  
      @media (max-width: 480px) {
        .chat-container {
          width: 100%;
          height: 100%;
          bottom: 0;
          right: 0;
          left: 0;
          border-radius: 15px 15px 0 0;
        }
  
        .chat-toggle-button.chat-open {
          display: none !important;
        }
  
        .chat-header {
          padding: 12px 15px;
        }
  
        .header-icon {
          width: 30px;
          height: 30px;
          font-size: 10px;
        }
  
        .chat-profile .profile-image {
          width: 60px;
          height: 60px;
          font-size: 20px;
        }
      }
  
      @media (max-height: 500px) and (orientation: landscape) {
        .chat-container {
          height: 98%;
          bottom: 10px;
          right: 10px;
          max-width: 99%;
        }
  
        .chat-profile {
          padding: 10px 0;
        }
  
        .profile-image {
          width: 50px;
          height: 50px;
          font-size: 18px;
          margin-bottom: 5px;
        }
  
        .chat-input {
          padding: 10px;
        }
  
        .input-field {
          min-height: 38px;
          max-height: 80px;
        }
  
        .chat-toggle-button.chat-open {
          bottom: auto;
          top: 20px;
          right: 20px;
        }
      }
  
      /* Efecto hover sobre el botón */
      .floating-button:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      }
  
      .floating-button:hover .button-img {
        transform: scale(1.2);
      }
  
      /* Círculos que salen detrás del botón */
      .floating-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background-color: var(--primary-color);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: circleEffect 1.6s ease-out infinite;
        animation-fill-mode: forwards;
        /* Asegura que el estado final se mantenga */
      }
  
      /* Animación de círculos que salen gradualmente */
      @keyframes circleEffect {
  
        0% {
          width: 0;
          height: 0;
          opacity: 0;
        }
  
        25% {
          width: 0;
          height: 0;
          opacity: 0.9;
        }
  
        50% {
          width: 100px;
          height: 100px;
          opacity: 0.6;
        }
  
        100% {
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
  
      /* Estilo para el mensaje de "Cotizaciones aquí" */
      .cotizacion-message {
  
        width: 83%;
        height: 76px;
        position: fixed;
        bottom: 14px;
        right: 15px;
        background-color: #ffffff;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        padding: 8px 20px;
        border-radius: 69px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        pointer-events: none;
        z-index: 1;
        display: flex;
        align-items: center;
        color: #747474;
      }
  
      /* Posición y estilo del botón de cerrar */
      .cotizacion-message .close-btn {
        width: 27px;
        background: #ffffff;
        color: #8d8d8d;
        font-size: 23px;
        cursor: pointer;
        margin-left: 10px;
        position: absolute;
        top: -7px;
        left: -8px;
        z-index: 10000;
        border: none;
        border-radius: 39px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
  
      /* Cuando el mensaje se vuelve visible */
      .show-message {
        opacity: 1;
        pointer-events: all;
        /* Permite la interacción con el mensaje cuando se muestra */
        width: 80%
      }
  
      .message-container-modal {
        width: 81%;
        font-family: "Helvetica Neue", "Apple Color Emoji", Helvetica, Arial, sans-serif;
        font-size: 15px;
        margin-left: 7px;
        padding: 8px;
      }
  
      /* Media Query para escritorio (pantallas más grandes) */
      @media (min-width: 769px) {
        .cotizacion-message {
          width: 326px !important;
        }
      }
  
  
      .floating-button.no-circle-effect::before {
        animation: none !important;
      }
    `;

    // Insertar el CSS en el head
    document.head.appendChild(styleElement);

    // Agregar Font Awesome si no está presente
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const faLink = document.createElement('link');
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
      faLink.rel = 'stylesheet';
      document.head.appendChild(faLink);
    }

    document.body.appendChild(container);

    // Referencias a elementos del DOM
    this.elements = {
      chatMessages: document.getElementById('chat-messages'),
      userInput: document.getElementById('user-input'),
      sendButton: document.getElementById('send-button'),
      chatToggle: document.getElementById('chat-toggle'),
      chatContainer: document.getElementById('chat-container'),
      closeButton: document.getElementById('close-button'),
      refreshButton: document.getElementById('refresh-button'),
      chatProfile: document.getElementById('chat-profile'),
      waitingOverlay: document.getElementById('waiting-overlay'),
      confirmDialog: document.getElementById('confirm-dialog'),
      confirmReset: document.getElementById('confirm-reset'),
      cancelReset: document.getElementById('cancel-reset'),
      chatbotName: document.getElementById('chatbot-name'),
      profileName: document.getElementById('profile-name'),
      welcomeTime: document.getElementById('welcome-time'),
      welcomeMessage: document.getElementById('welcome-message'),
      welcomeTimestamp: document.getElementById('welcome-timestamp'),
      headerIconImg: document.getElementById('header-icon-img'),
      profileImageImg: document.getElementById('profile-image-img'),
      messageAvatarImg: document.getElementById('message-avatar-img'),
      scrollToBottomBtn: document.getElementById('scroll-to-bottom'),
      floatingMessage: document.querySelector('.cotizacion-message'),
      messageContainer: document.querySelector('.message-container-modal'),
      closeMessageBtn: document.querySelector('.cotizacion-message .close-btn')
    };
  }

  // Aplicar configuración personalizada
  applyConfig() {
    const { config, elements } = this;

    // Configurar botón flotante
    if (!config.enableCircleEffect) {
      elements.chatToggle.classList.add('no-circle-effect');
    }

    // Configurar mensaje flotante
    if (config.showFloatingMessage) {
      elements.messageContainer.innerHTML = config.floatingMessageText || '';
      elements.messageContainer.style.fontFamily = config.floatingMessageFont || '';
      elements.messageContainer.style.fontSize = config.floatingMessageSize || '';
      elements.messageContainer.style.color = config.floatingMessageColor || '';
    } else {
      document.getElementById('idbtnflotantediv').style.display = 'none';
    }

    // Establecer nombres
    elements.chatbotName.textContent = config.companyName;
    elements.profileName.textContent = config.chatbotName;

    // Establecer avatares
    elements.headerIconImg.src = config.headerIconImg;
    elements.profileImageImg.src = config.profileImageImg;
    elements.messageAvatarImg.src = config.botAvatar;

    // Establecer color primario
    this.setPrimaryColor(config.primaryColor);

    // Establecer modo oscuro
    this.toggleDarkMode(config.darkMode);

    // Actualizar mensaje de bienvenida
    if (elements.welcomeMessage) {
      elements.welcomeMessage.innerHTML = config.welcomeMessage.replace(/\n/g, '<br>');
    }

    // Actualizar placeholder del input
    elements.userInput.placeholder = config.inputPlaceholder;

    // Actualizar hora del mensaje de bienvenida
    this.updateWelcomeTime();

    // Establecer fecha de bienvenida
    elements.welcomeTimestamp.textContent = this.formatDate(new Date());

    // Mostrar mensaje flotante después de 6 segundos
    if (config.showFloatingMessage) {
      setTimeout(() => {
        elements.floatingMessage.classList.add('show-message');
      }, 6000);
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    const { elements } = this;

    // Evento para enviar mensaje con Enter
    elements.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = elements.userInput.selectionStart;
        const end = elements.userInput.selectionEnd;

        elements.userInput.value = elements.userInput.value.substring(0, start) +
          '    ' + elements.userInput.value.substring(end);

        elements.userInput.selectionStart = elements.userInput.selectionEnd = start + 4;
        this.adjustTextareaHeight();
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Evento para redimensionar textarea
    elements.userInput.addEventListener('input', () => this.adjustTextareaHeight());

    // Evento para enviar mensaje con botón
    elements.sendButton.addEventListener('click', () => this.sendMessage());

    // Evento para alternar chat
    elements.chatToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.isAnimating) return;
      this.isChatOpen ? this.closeChat() : this.openChat();
    });

    // Evento para cerrar chat
    elements.closeButton.addEventListener('click', () => this.closeChat());

    // Evento para reiniciar chat
    elements.refreshButton.addEventListener('click', () => {
      if (this.isWaitingForResponse) return;
      const messages = document.querySelectorAll('.message, .html-message');
      messages.length > 1 ? this.showConfirmDialog() : this.refreshChat();
    });

    // Eventos para diálogo de confirmación
    elements.confirmReset.addEventListener('click', () => {
      this.hideConfirmDialog();
      this.refreshChat();
    });

    elements.cancelReset.addEventListener('click', () => this.hideConfirmDialog());

    // Evento para scroll
    elements.chatMessages.addEventListener('scroll', () => {
      this.scrollPosition = elements.chatMessages.scrollTop;
      const isAtBottom = elements.chatMessages.scrollHeight -
        elements.chatMessages.scrollTop - elements.chatMessages.clientHeight < 300;
      isAtBottom ?
        elements.scrollToBottomBtn.classList.remove('show') :
        elements.scrollToBottomBtn.classList.add('show');
    });

    // Evento para botón de scroll
    elements.scrollToBottomBtn.addEventListener('click', () => this.scrollToBottom());

    // Evento para cerrar mensaje flotante
    elements.closeMessageBtn.addEventListener('click', () => {
      elements.floatingMessage.style.display = 'none';
    });

    // Evento para cerrar chat al hacer clic fuera en móvil
    document.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 767;
      if (isMobile && this.isChatOpen &&
        !elements.chatContainer.contains(e.target) &&
        e.target !== elements.chatToggle) {
        this.closeChat();
      }
    });

    // Evento para cambio de orientación
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (this.isChatOpen) {
          if (window.orientation === 90 || window.orientation === -90) {
            elements.chatContainer.style.height = '95vh';
            elements.chatContainer.style.maxHeight = '450px';
          } else {
            elements.chatContainer.style.height = '';
            elements.chatContainer.style.maxHeight = '';
          }
          this.scrollToBottom(true);
        }
      }, 300);
    });

    // Evento para redimensionamiento
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 767;
      if (isMobile && this.isChatOpen) {
        elements.chatToggle.style.display = 'none';
      } else {
        elements.chatToggle.style.display = 'flex';
      }
    });


    // Manejar el enfoque en el input en móviles
    elements.userInput.addEventListener('focus', () => {
      if (window.innerWidth <= 767) {
        // Asegurarnos que el chat está abierto
        if (!this.isChatOpen) this.openChat();

        // Scroll hasta el final con un pequeño retraso para asegurar que el teclado está visible
        setTimeout(() => {
          this.scrollToBottom(true);
          // Opcional: puedes agregar un desplazamiento adicional si es necesario
          window.scrollTo(0, document.body.scrollHeight);
        }, 300);
      }
    });

    // Asegurar que el input siempre sea visible al escribir
    elements.userInput.addEventListener('input', () => {
      if (window.innerWidth <= 767) {
        this.scrollToBottom(true);
      }
    });

    // Manejar cambios de tamaño (cuando el teclado aparece/desaparece)
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 767 && this.isChatOpen && document.activeElement === elements.userInput) {
        setTimeout(() => {
          this.scrollToBottom(true);
        }, 100);
      }
    });

  }

  // Cargar contenido inicial
  loadInitialContent() {
    const existingGuid = localStorage.getItem('chatGuid');
    existingGuid ? this.getConversationHistory() : this.showInitialMessage(); // vuelve a poner si la carga es inicial
  }

  // Métodos de utilidad
  generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

  }

  formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    const isToday = date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isYesterday = date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const isDayBeforeYesterday = date.getDate() === dayBeforeYesterday.getDate() &&
      date.getMonth() === dayBeforeYesterday.getMonth() &&
      date.getFullYear() === dayBeforeYesterday.getFullYear();

    if (this.config.showTodayLabel && isToday) return "Hoy";
    if (this.config.showYesterdayLabel && isYesterday) return "Ayer";
    if (this.config.showDayBeforeYesterdayLabel && isDayBeforeYesterday) return "Antier";

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (this.config.dateFormat) {
      case "DD/MM/YYYY": return `${day}/${month}/${year}`;
      case "MM/DD/YYYY": return `${month}/${day}/${year}`;
      case "YYYY-MM-DD": return `${year}-${month}-${day}`;
      default: return `${day}/${month}/${year}`;
    }
  }

  formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    switch (this.config.timeFormat) {
      case "HH:mm": return `${hours.toString().padStart(2, '0')}:${minutes}`;
      case "h:mm a":
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes} ${ampm}`;
      case "h:mm:ss a":
        const ampm2 = hours >= 12 ? 'PM' : 'AM';
        const hours122 = hours % 12 || 12;
        return `${hours122}:${minutes}:${seconds} ${ampm2}`;
      default: return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  checkNewDayTimestamp(timestamp = new Date()) {
    if (!this.config.showTimestampForNewDay) return false;

    const currentDate = this.formatDate(timestamp);

    if (!this.lastMessageDate || this.lastMessageDate !== currentDate) {
      this.lastMessageDate = currentDate;

      const timestampDiv = document.createElement('div');
      timestampDiv.className = 'timestamp';
      timestampDiv.textContent = currentDate;
      this.elements.chatMessages.appendChild(timestampDiv);

      return true;
    }
    return false;
  }

  updateWelcomeTime() {
    if (this.elements.welcomeTime) {
      const now = new Date();
      this.elements.welcomeTime.textContent = this.formatTime(now);
    }
  }

  // Métodos principales
  async getConversationHistory() {
    try {
      this.toggleInputState(true);

      const existingGuid = localStorage.getItem('chatGuid');
      if (!existingGuid) {
        this.toggleInputState(false);
        return;
      }

      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'history-loading';
      loadingDiv.innerHTML = `
          <div class="history-loading-spinner"></div>
          <div>Cargando historial de conversación...</div>
        `;

      while (this.elements.chatMessages.firstChild) {
        this.elements.chatMessages.removeChild(this.elements.chatMessages.firstChild);
      }

      this.elements.chatMessages.appendChild(this.elements.chatProfile);
      this.elements.chatMessages.appendChild(loadingDiv);

      const response = await fetch(
        `${this.config.apiUrl}/${encodeURIComponent(this.conversationGuid)}?${new URLSearchParams({
          moduleActive:  'task-module'
        })}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.bearerToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data?.success && data?.data?.length > 0) {
          const conversation = data.data;
          let currentDate = null;
          let lastTimestamp = null;

          conversation.forEach(msg => {
            const messageDate = new Date(msg.created_at);
            const formattedDate = this.formatDate(messageDate);

            if (formattedDate !== lastTimestamp) {
              const timestamp = document.createElement('div');
              timestamp.className = 'timestamp';
              timestamp.textContent = formattedDate;
              this.elements.chatMessages.appendChild(timestamp);
              lastTimestamp = formattedDate;
            }

            if (msg.role === 'user') {
              this.addMessage(msg.content, true, (msg.message_type == 'html') || false, messageDate);
            } else {
              this.addMessage(msg.content, false, (msg.message_type == 'html') || false, messageDate);
            }

            this.lastMessageDate = formattedDate;

          });

          this.elements.chatMessages.removeChild(loadingDiv);
        } else {
          this.showInitialMessage();
        }
      } else {
        console.error('Error al cargar historial:', response.statusText);
        this.showInitialMessage();
      }


      this.scrollToBottom(true);

    } catch (error) {
      console.error('Error al cargar historial:', error);
      this.showInitialMessage();
    } finally {
      this.toggleInputState(false);
    }
  }

  showInitialMessage() {
    const profileElement = this.elements.chatProfile;

    while (this.elements.chatMessages.firstChild) {
      this.elements.chatMessages.removeChild(this.elements.chatMessages.firstChild);
    }

    const now = new Date();
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = this.formatDate(now);
    this.elements.chatMessages.appendChild(timestamp);

    this.elements.chatMessages.appendChild(profileElement);

    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message bot';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';

    const avatarImg = document.createElement('img');
    avatarImg.src = this.config.botAvatar;
    avatarImg.alt = this.config.chatbotName;
    avatar.appendChild(avatarImg);

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = this.config.welcomeMessage.replace(/\n/g, '<br>');

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = this.formatTime(now);

    content.appendChild(time);
    welcomeMessage.appendChild(avatar);
    welcomeMessage.appendChild(content);

    this.elements.chatMessages.appendChild(welcomeMessage);
    this.lastMessageDate = this.formatDate(now);
  }

  async sendMessageToAPI(message) {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.bearerToken}`
        },
        body: JSON.stringify({
          message: message,
          guid: this.conversationGuid,
           moduleActive:  'task-module'
        })
      });

      if (response.status === 200) {
        return await response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }

  sendPredefinedMessage(text) {
    if (this.isWaitingForResponse) return;
    this.toggleInputState(true);

    const now = new Date();
    this.checkNewDayTimestamp(now);
    this.addMessage(text, true, false, now);

    this.elements.userInput.value = '';
    this.elements.userInput.style.height = 'auto';
    this.getBotResponse(text);
  }

 openChat() {
  if (this.isAnimating || this.isChatOpen) return;

  this.isAnimating = true;
  this.isChatOpen = true;

  this.elements.chatContainer.style.display = 'flex';
  this.elements.chatContainer.classList.add('active');
  this.elements.chatToggle.classList.add('chat-open');

  // Enfoque inmediato y scroll al final
  setTimeout(() => {
    this.elements.userInput.focus();
    this.scrollToBottom(true);
    
    // En móviles, hacer scroll adicional para asegurar visibilidad
    if (window.innerWidth <= 767) {
      setTimeout(() => {
        this.scrollToBottom(true);
        // Esto fuerza al navegador a mostrar el input
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    }
    
    this.isAnimating = false;
  }, 50);
}

  closeChat() {
    if (this.isAnimating || !this.isChatOpen) return;

    this.isAnimating = true;
    this.scrollPosition = this.elements.chatMessages.scrollTop;

    this.elements.chatContainer.classList.add('closing');
    this.elements.chatContainer.classList.remove('active');
    this.elements.chatToggle.classList.remove('chat-open');

    setTimeout(() => {
      this.elements.chatContainer.classList.remove('closing');
      this.elements.chatContainer.style.display = 'none';
      this.isChatOpen = false;
      this.isAnimating = false;
    }, 300);
  }

  toggleInputState(disabled) {
    this.isWaitingForResponse = disabled;

    if (disabled) {
      this.elements.userInput.classList.add('disabled');
      this.elements.sendButton.classList.add('disabled');
      this.elements.userInput.setAttribute('disabled', 'disabled');
      this.elements.waitingOverlay.classList.add('active');
    } else {
      this.elements.userInput.classList.remove('disabled');
      this.elements.sendButton.classList.remove('disabled');
      this.elements.userInput.removeAttribute('disabled');
      this.elements.waitingOverlay.classList.remove('active');
    }
  }

  markdownToHtml(text) {
    let html = text.replace(/\n/g, '<br>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li>$2</li>');
    return html;
  }

  addMessage(content, isUser = false, isHTML = false, timestamp = new Date()) {
    if (isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message user';

      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'message-avatar';

      const avatarImg = document.createElement('img');
      avatarImg.src = this.config.userAvatar;
      avatarImg.alt = 'Usuario';
      avatarDiv.appendChild(avatarImg);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.textContent = content;

      const timeDiv = document.createElement('div');
      timeDiv.className = 'message-time';
      timeDiv.textContent = this.formatTime(timestamp);
      contentDiv.appendChild(timeDiv);

      messageDiv.appendChild(avatarDiv);
      messageDiv.appendChild(contentDiv);

      this.elements.chatMessages.appendChild(messageDiv);
    } else {
      if (isHTML) {
        const htmlDiv = document.createElement('div');
        htmlDiv.className = 'html-message';
        htmlDiv.innerHTML = content;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'html-message-time';
        timeDiv.textContent = this.formatTime(timestamp);
        htmlDiv.appendChild(timeDiv);

        this.elements.chatMessages.appendChild(htmlDiv);
      } else {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';

        const avatarImg = document.createElement('img');
        avatarImg.src = this.config.botAvatar;
        avatarImg.alt = this.config.chatbotName;
        avatarDiv.appendChild(avatarImg);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.markdownToHtml(content);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(timestamp);
        contentDiv.appendChild(timeDiv);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        this.elements.chatMessages.appendChild(messageDiv);
      }
    }

    this.scrollToBottom();
  }

  async getBotResponse(userMessage) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';

    const typingAvatar = document.createElement('div');
    typingAvatar.className = 'message-avatar';

    const avatarImg = document.createElement('img');
    avatarImg.src = this.config.botAvatar;
    avatarImg.alt = this.config.chatbotName;
    typingAvatar.appendChild(avatarImg);

    const typingWrapper = document.createElement('div');
    typingWrapper.className = 'typing-wrapper';
    typingWrapper.setAttribute('data-typing-text', this.config.typingText);

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      typingIndicator.appendChild(dot);
    }

    typingWrapper.appendChild(typingIndicator);
    typingDiv.appendChild(typingAvatar);
    typingDiv.appendChild(typingWrapper);

    this.elements.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();

    try {
      const response = await this.sendMessageToAPI(userMessage);
      this.elements.chatMessages.removeChild(typingDiv);

      const now = new Date();
      this.checkNewDayTimestamp(now);

      if (response.message) {
        this.addMessage(response.message, false, false, now);
      }

      if (response.html) {
        this.addMessage(response.html, false, true, now);
      }

    } catch (error) {
      this.elements.chatMessages.removeChild(typingDiv);
      const now = new Date();
      this.addMessage(`Lo siento, ha ocurrido un error: ${error.message}`, false, false, now);
    } finally {
      this.toggleInputState(false);
      this.elements.userInput.focus();
    }
  }

  refreshChat() {
    this.conversationGuid = this.generateGuid();
    localStorage.setItem('chatGuid', this.conversationGuid);
    this.showInitialMessage();
    this.scrollPosition = 0;
  }

  adjustTextareaHeight() {
    this.elements.userInput.style.height = 'auto';
    this.elements.userInput.style.height = Math.min(this.elements.userInput.scrollHeight, 120) + 'px';
  }

  sendMessage() {
    if (this.isWaitingForResponse) return;

    const message = this.elements.userInput.value.trim();
    if (message !== '') {
      this.toggleInputState(true);

      const now = new Date();
      this.checkNewDayTimestamp(now);
      this.addMessage(message, true, false, now);

      this.elements.userInput.value = '';
      this.elements.userInput.style.height = 'auto';
      this.getBotResponse(message);
    }
  }

  showConfirmDialog() {
    this.elements.confirmDialog.classList.add('active');
  }

  hideConfirmDialog() {
    this.elements.confirmDialog.classList.remove('active');
  }

  scrollToBottom(force = false) {
    if (force) {
      this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    } else {
      this.elements.chatMessages.scrollTo({
        top: this.elements.chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  setPrimaryColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    this.elements.chatToggle.style.backgroundColor = color;
  }

  toggleDarkMode(enable) {
    this.config.darkMode = enable;
    enable ?
      this.elements.chatContainer.classList.add('dark-mode') :
      this.elements.chatContainer.classList.remove('dark-mode');
  }

  closeMessage() {
    if (this.elements.floatingMessage) {
      this.elements.floatingMessage.style.display = 'none';
    }
  }
}

// Exportar la clase para su uso como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FloatingChatbot;
} else if (typeof window !== 'undefined') {
  window.FloatingChatbot = FloatingChatbot;
}