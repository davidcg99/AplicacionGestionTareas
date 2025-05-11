

  // Define helper functions first
  function adjustColor(hex, percent) {
    if (!hex.startsWith('#')) return hex;
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const adjustR = Math.max(0, Math.min(255, r + percent));
    const adjustG = Math.max(0, Math.min(255, g + percent));
    const adjustB = Math.max(0, Math.min(255, b + percent));
    return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
  }
  
  function setThemeColor(primaryColor) {
    // Establecer color principal
    document.documentElement.style.setProperty('--brand-color', primaryColor);
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    
    // Generar colores derivados
    const darkColor = adjustColor(primaryColor, -20);
    const lightColor = adjustColor(primaryColor, 40);
    const accentColor = adjustColor(primaryColor, 80); // Generar automáticamente el color de acento
    
    // Establecer propiedades derivadas
    document.documentElement.style.setProperty('--brand-color-hover', darkColor);
    document.documentElement.style.setProperty('--brand-accent', lightColor);
    document.documentElement.style.setProperty('--primary-hover', darkColor);
    
    // Actualizar también el color del título y fondos relevantes
    if (primaryColor.startsWith('#')) {
      // Para el título, usar una versión más oscura del color principal
      const titleColor = adjustColor(primaryColor, -30);
      document.documentElement.style.setProperty('--title-color', titleColor);
      document.documentElement.style.setProperty('--title-color-dark', accentColor);
      
      // Ajustar gradiente del fondo en modo claro
      const endColor = adjustColor(primaryColor, 200);
      const bgGradient = `linear-gradient(135deg, #f5f7fa 0%, ${endColor} 100%)`;
      document.documentElement.style.setProperty('--background-gradient-light', bgGradient);
      
      // Ajustar gradiente del fondo en modo oscuro
      const darkEndColor = adjustColor(accentColor, -60);
      const bgGradientDark = `linear-gradient(135deg, #1f2937 0%, ${darkEndColor} 100%)`;
      document.documentElement.style.setProperty('--background-gradient-dark', bgGradientDark);
      
      // Asegurar que cambie el color de los botones y otros elementos interactivos
      //document.documentElement.style.setProperty('--error', primaryColor);
      
      // Cambiar logo shadow color
      const logoShadow = `0 8px 20px ${primaryColor}40`;
      const logoShadowHover = `0 12px 25px ${primaryColor}60`;
      document.documentElement.style.setProperty('--logo-shadow', logoShadow);
      document.documentElement.style.setProperty('--logo-shadow-hover', logoShadowHover);
      
      // Scrollbar colors for dark mode
      document.documentElement.style.setProperty('--scrollbar-thumb-dark', `${accentColor}30`);
      document.documentElement.style.setProperty('--scrollbar-thumb-hover-dark', `${accentColor}50`);
      
      // Button shadow
      document.documentElement.style.setProperty('--btn-shadow', `0 4px 12px ${primaryColor}33`);
      document.documentElement.style.setProperty('--btn-shadow-hover', `0 6px 15px ${primaryColor}4D`);
      
      // Adjust form control focus shadow
      document.documentElement.style.setProperty('--input-focus-shadow', `0 0 0 3px ${primaryColor}26`);
    }
    
    // Aplicar cambios directamente a los elementos
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
      logoImg.style.boxShadow = `0 8px 20px ${primaryColor}40`;
    }
    
    // Update form-floating focus shadow
    const formFloatingStyle = document.createElement('style');
    formFloatingStyle.textContent = `
      .form-floating.focused {
        box-shadow: 0 4px 12px ${primaryColor}26 !important; 
      }
      .dark-mode .form-floating.focused {
        box-shadow: 0 4px 12px ${primaryColor}40 !important;
      }
      .form-control:focus {
        border-color: ${primaryColor} !important;
        box-shadow: 0 0 0 3px ${primaryColor}26 !important;
      }
      .dark-mode .form-control:focus {
        box-shadow: 0 0 0 3px ${primaryColor}40 !important;
      }
      .forgot-password:hover {
        color: ${primaryColor} !important;
      }
      .password-toggle:hover {
        color: ${primaryColor} !important; 
      }
      .form-floating input:focus ~ label {
        color: ${primaryColor} !important;
      }
      .dark-mode .card-body::-webkit-scrollbar-thumb {
        background-color: ${accentColor}30 !important;
      }
      .dark-mode .card-body::-webkit-scrollbar-thumb:hover {
        background-color: ${accentColor}50 !important;
      }
    `;
    document.head.appendChild(formFloatingStyle);
}

const scriptTag = document.currentScript;
  // Inicializar tema
  const ThemeColor = scriptTag.getAttribute("color-theme"); 
  setThemeColor(ThemeColor);
  
  // Hacer disponible la función para uso global
  window.setThemeColor = setThemeColor;
  
  // Actualizar estilos CSS para sombras del logo
  const styleElement = document.createElement('style');
  styleElement.textContent = `
  .logo-img {
    box-shadow: var(--logo-shadow, 0 8px 20px rgba(37, 99, 235, 0.25)) !important;
  }
  .logo-img:hover {
    box-shadow: var(--logo-shadow-hover, 0 12px 25px rgba(37, 99, 235, 0.35)) !important;
  }
  .btn-primary {
    box-shadow: var(--btn-shadow, 0 4px 12px rgba(37, 99, 235, 0.2)) !important;
    background: linear-gradient(145deg, var(--brand-color), var(--brand-color-hover)) !important;
  }
  .btn-primary:hover {
    box-shadow: var(--btn-shadow-hover, 0 6px 15px rgba(37, 99, 235, 0.3)) !important;
    background: linear-gradient(145deg, var(--brand-color-hover), var(--brand-color)) !important;
  }
`;
  document.head.appendChild(styleElement);
  
  const darkMode = localStorage.getItem('darkMode') === 'true';
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    this.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
  
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');
  togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
    passwordField.focus();
  });
  
  const inputs = document.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });
  
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const hideError = function() {
      errorMessage.style.opacity = '0';
      errorMessage.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        errorMessage.style.display = 'none';
      }, 300);
    };
    usernameField.addEventListener('input', hideError);
    passwordField.addEventListener('input', hideError);
    errorMessage.style.transition = 'opacity 0.3s, transform 0.3s';
  }
  
  const loginForm = document.getElementById('loginForm');
  const submitButton = document.getElementById('submitButton');
  loginForm.addEventListener('submit', function(e) {
    submitButton.classList.add('loading');
    submitButton.querySelector('span').innerHTML = 'wait...';
  });
  
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const size = Math.random() * 15 + 5;
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `-${size}px`;
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    const duration = Math.random() * 25 + 15;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 15}s`;
    particlesContainer.appendChild(particle);
  }
}

createParticles();