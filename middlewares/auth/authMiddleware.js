const jwt = require("jsonwebtoken");
const dataUserModel = require("../../models/auth/user");

class AuthMiddleware {
  // Middleware para verificar y cargar autenticación
  static getAuth(req, res, next) {
    // Inicializa la sesión si no existe
    req.session.user ??= {
      username: null,
      token: null,
      rol: null,
      createdAt: null,
      expiresAt: null,
    };
 
    //const { token } = req.session.user;
    const token  = req.cookies["tokenAuth"];
    const isLoginPath = req.path === "/";
    const isDashboardPath = req.path === "/moduleTask";
    const nonce = res.locals.nonce;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        // Token inválido o expirado
        return isDashboardPath
          ? res.redirect("/")
          : res.render("auth/login", {
              title: "Login",
              error: null,
              layout: "layouts/auth",
              nonce: nonce,
              colorTheme: process.env.COLOR_THEME
            });
      }

      // Token válido: actualiza datos de sesión si es necesario
      req.session.user.username = decoded.user_name;
      req.session.user.rol = decoded.rol;

      if (isLoginPath) return res.redirect("/moduleTask");

      if (isDashboardPath) {
        return res.render("moduleTask/index", {
          title: "Task",
          user: decoded.user_name,
          rol: decoded.rol,
          layout: "layouts/main",
          nonce: nonce,
          colorTheme: process.env.COLOR_THEME
        });
      }

      next(); // Continuar a siguiente middleware si no es login ni dashboard
    });
  }
  // Middleware para logout
  static logout(req, res) {
    try {
      if (req.session.user) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Session destruction error:", err);
            return res.redirect("/");
          }

          res.clearCookie("tokenAuth"); // Ajusta si usas otro nombre de cookie
          return res.redirect("/?logout=success");
        });
      } else {
        return res.redirect("/");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
      return res.redirect("/?logout=error");
    }
  }
  
  static getAuthApi = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    // Verifica si se envió el header Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado o formato inválido',
      });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const secretKey = process.env.JWT_SECRET; // Usa .env si tienes
      const decoded = jwt.verify(token, secretKey);
  
      // Puedes adjuntar datos del usuario al request
      req.user = decoded;
  
      next(); // Permite pasar al siguiente middleware/controlador
    } catch (err) {
      return res.status(403).json({
        success: false,
        error: 'Token inválido o expirado',
      });
    }
  };
  
  static getAuthAccess = (req, res, next) => {
    
    const token = req.cookies["token-auth"];
  
    try {
      const secretKey = process.env.JWT_SECRET; // Usa .env si tienes
      const decoded = jwt.verify(token, secretKey); 
      // Puedes adjuntar datos del usuario al request
      req.user = decoded;
  
      next(); // Permite pasar al siguiente middleware/controlador
    } catch (err) {
      return res.status(403).json({
        success: false,
        error: 'Token inválido o expirado',
      });
    }
  };

 static generateToken = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // 🔹 Consultar usuario en la base de datos
      const usuario = await dataUserModel.getUser(username, password);
  
      // 🔹 Validar resultado
      if (!usuario.valid || !usuario.data?.length) {
        return res.status(401).json({
          error: usuario.message || "Credenciales incorrectas.",
        });
      }
  
      // 🔹 Obtener los datos del primer usuario retornado
      const user = usuario.data[0];
  
      // 🔹 Generar token JWT con información del usuario
      const token = jwt.sign(
        {
          user_name: user.user_name,
          user_login: user.user_login,
          rol: user.role_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      );
  
      // 🔹 También puedes guardar sesión o cookies si lo necesitas (opcional)
      req.session.user = {
        user_name: user.user_name,
        user_login: user.user_login,
        rol: user.role_name,
        token,
      };
  
  
      // 🔹 Enviar respuesta JSON con el token y datos del usuario
      return res.json({
        token,
        user: {
          user_name: user.user_name,
          user_login: user.user_login,
          rol: user.role_name
        }
      });
  
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(500).json({
        error: "Ocurrió un error al obtener el token."
      });
    }
  };
  
}



module.exports = AuthMiddleware;
