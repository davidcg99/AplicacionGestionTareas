// public/js/main.js
document.addEventListener('DOMContentLoaded', function() {


        if (window.FloatingChatbot) {
            window.miChatbot = new FloatingChatbot({
                companyName: "chat bot",
                chatbotName: "chat Intelligence",
                primaryColor: "#bb0c0c",
                welcomeMessage: "¡Hola! ¿En qué puedo ayudarte hoy?",
                darkMode: false,
                apiUrl: "/api/v1/chat/conversation",
                bearerToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJEYXZpZCBDaWQiLCJ1c2VyX2xvZ2luIjoiZGF2aWRjZyIsInJvbCI6bnVsbCwiaWF0IjoxNzQ2OTE5NzU0LCJleHAiOjE3NDcwMDYxNTR9.rzN80fjZGxgUh91RCZP5oArAg-yLhoLRr7PmCYsBuks"
            });
        }
    
    // Inicializar la biblioteca indicadores de carga
    const indicator = new MinimalistIndicator({
      blurBackground: false
    });
  
    const darkMode = localStorage.getItem('darkMode') === 'true';
    indicator.toggleDarkModeIndicator(darkMode);
  
    // Inicializar la biblioteca con configuración por defecto
    window.mintAlerts = window.mintAlertsLib;
    window.mintAlerts.init({
      position: 'top-right',
      darkMode: darkMode
    });


  });

  