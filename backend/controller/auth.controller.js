import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import usersData from '../data/usuarios.json' with { type: "json" };

let refreshTokens = []; // Para manejar logout

const JWT_SECRET = process.env.JWT_SECRET || "encriptacion";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "encriptacion";
const SALT_ROUNDS = 10;

// Función helper para generar tokens
const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Función helper para buscar usuario por email
const findUserByEmail = (email) => {
  return usersData.find(user => user.email === email);
};

// REGISTRO DE USUARIO
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body || {};

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear nuevo usuario
    const newUser = {
      id: usersData.length > 0 ? Math.max(...usersData.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    usersData.push(newUser);

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(newUser);
    refreshTokens.push(refreshToken);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// LOGIN DE USUARIO
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.push(refreshToken);

    // Extraer la contraseña del objeto user y retornar el resto
    const { password: userPassword, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (refreshToken) {
      // Remover refresh token
      const tokenIndex = refreshTokens.indexOf(refreshToken);
      if (tokenIndex > -1) {
        refreshTokens.splice(tokenIndex, 1);
      }
    }

    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};