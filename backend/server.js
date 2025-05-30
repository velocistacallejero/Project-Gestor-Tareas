const app = require('./app');
const db = require('./config/db');
const { PORT } = require('./config/config');

// Importar modelos para sincronización
require('./models/User');
// require('./models/Task');
// require('./models/Team');
// require('./models/Meeting');
// require('./models/Notification');

// Sincronizar modelos con la base de datos
db.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida');
    return db.sync({ force: false }); // Cambiar a true solo en desarrollo para resetear tablas
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });