const db = require('../config/db');
const User = require('./User');
const Task = require('./Task');
const Team = require('./Team');
const Meeting = require('./Meeting');
const Notification = require('./Notification');

// Relaciones User-Task (Un usuario tiene muchas tareas)
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

// Relaciones User-Team (Muchos a muchos)
const UserTeam = db.define('UserTeam', {});
User.belongsToMany(Team, { through: UserTeam });
Team.belongsToMany(User, { through: UserTeam });

// Relaciones Team-Task (Un equipo tiene muchas tareas)
Team.hasMany(Task, { foreignKey: 'teamId' });
Task.belongsTo(Team, { foreignKey: 'teamId' });

// Relaciones User-Notification (Un usuario tiene muchas notificaciones)
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Relaciones User-Meeting (Un usuario tiene muchas reuniones)
User.hasMany(Meeting, { foreignKey: 'userId' });
Meeting.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Task,
  Team,
  Meeting,
  Notification,
  UserTeam
};