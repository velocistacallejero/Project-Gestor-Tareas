const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// Helper para enviar token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  res.status(statusCode).json({
    success: true,
    token
  });
};

// Registro de usuario
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ErrorResponse('El correo electrónico ya está registrado', 400));
    }

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password // El hash se hace en el hook beforeCreate del modelo
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Error detallado:', err);
    next(new ErrorResponse('Error al registrar el usuario: ' + err.message, 500));
  }
};

// Login de usuario
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Por favor ingresa un email y contraseña', 400));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(new ErrorResponse('Credenciales inválidas', 401));
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse('Credenciales inválidas', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(new ErrorResponse('Error al iniciar sesión', 500));
  }
};