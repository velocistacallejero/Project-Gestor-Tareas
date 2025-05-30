const { Task, User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// Obtener todas las tareas del usuario
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['endDate', 'ASC']]
    });

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

// Crear nueva tarea
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Actualizar tarea
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return next(new ErrorResponse(`Tarea no encontrada con id ${req.params.id}`, 404));
    }

    // Verificar que la tarea pertenece al usuario
    if (task.userId !== req.user.id) {
      return next(new ErrorResponse('No autorizado para actualizar esta tarea', 401));
    }

    await task.update(req.body);

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Eliminar tarea
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return next(new ErrorResponse(`Tarea no encontrada con id ${req.params.id}`, 404));
    }

    // Verificar que la tarea pertenece al usuario
    if (task.userId !== req.user.id) {
      return next(new ErrorResponse('No autorizado para eliminar esta tarea', 401));
    }

    await task.destroy();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// Actualizar ubicación de tarea
exports.updateTaskLocation = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return next(new ErrorResponse(`Tarea no encontrada con id ${req.params.id}`, 404));
    }

    // Verificar que la tarea pertenece al usuario
    if (task.userId !== req.user.id) {
      return next(new ErrorResponse('No autorizado para actualizar esta tarea', 401));
    }

    await task.update({ location: req.body.location });

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};