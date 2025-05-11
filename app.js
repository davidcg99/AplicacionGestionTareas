const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const compression = require('compression');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const viewRoutes = require('./routes/task/viewRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const chatRoutes = require('./routes/chat/chatRoutes');
const taskRoutes = require('./routes/task/taskRoutes');
const secureHeaders = require('./middlewares/auth/secureHeaders');

// ✅ Usa el middleware modular
app.use(secureHeaders);

// app.js
app.use((err, req, res, next) => {
  // Force JSON response
  res.setHeader('Content-Type', 'application/json');
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors || []
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

//app.use(helmet());

app.use(cors({
  origin: '*', // Cambia '*' a tu dominio específico para mayor seguridad
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET,  // Puedes definir una clave secreta para la sesión
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" }  // Asegúrate de que esto esté en true en producción si usas HTTPS
}));
// Middleware para inicializar la sesión solo si no existe


// middlewares
app.use(morgan("common"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(compression());
// Middleware para analizar cookies
app.use(cookieParser());

// Configurar bodyParser para manejar las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Esto sirve los archivos estáticos desde la carpeta /public
app.use(express.static(path.join(__dirname, 'public')));

// Habilitar layouts pero sin predeterminado
app.use(expressLayouts);

// Middleware para datos de formulario
app.use(express.urlencoded({ extended: true }));

// Rutas

app.use('/', viewRoutes);
app.use('/', authRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/task', taskRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});