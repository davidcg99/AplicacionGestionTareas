const jwt = require("jsonwebtoken");
const dataUserModel = require("../../models/auth/user");
require("dotenv").config();
const ms = require('ms');


class AuthController {
  /**
   * Maneja el proceso de login: validación de usuario, generación de token y creación de sesión.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getUser(req, res) {
    try {

      const nonce = res.locals.nonce; // Guarda el nonce para la vista
      // 🔹 Obtener credenciales desde el formulario
      const { username, password } = req.body;

      // 🔹 Consultar usuario en la base de datos
      const usuario = await dataUserModel.getUser(username, password);

      // 🔹 Validar resultado
      if (!usuario.valid || !usuario.data?.length) {
        return res.render("auth/login", {
          title: "Login",
          error: usuario.message || "Credenciales incorrectas.",
          layout: "layouts/auth",
          nonce: nonce,
          colorTheme: process.env.COLOR_THEME
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
        { expiresIn: process.env.JWT_EXPIRES } // Valor configurado en .env (ej: '1h', '2d')
      );

      // 🔹 Guardar datos relevantes del usuario en la sesión
      req.session.user = {
        user_name: user.user_name,
        user_login: user.user_login,
        rol: user.role_name,
        token,
        user_id :user.user_id
      };

      let configCookie = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production", // en producción pon true + HTTPS
        sameSite: 'Lax',
        maxAge: ms(process.env.JWT_EXPIRES)
      };

      res.cookie('tokenAuth', token,  configCookie );
      res.cookie('userId', user.user_id , configCookie);

      return res.redirect("/moduleTask");

    } catch (error) {
      // 🔹 Manejo de errores y renderización del login con mensaje genérico
      console.error("Auth Error:", error.message);

      return res.render("auth/login", {
        title: "Login",
        error: "Ocurrió un error al iniciar sesión.",
        layout: "layouts/auth",
        nonce: nonce,
        colorTheme: process.env.COLOR_THEME
      });
    }
  }
}

module.exports = AuthController;
