const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Servir archivos estáticos desde la carpeta 'uploads'

const credentials = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pacientesclinica',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);  // Especificar la ruta de la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nombre del archivo basado en la fecha actual
  },
});

const upload = multer({ storage: storage });

app.post('/subirImagen/:id', upload.single('imagen'), (req, res) => {
  const { id } = req.params;
  const imagePath = path.join('uploads', req.file.filename);  // Guardar la ruta relativa de la imagen

  const connection = mysql.createConnection(credentials);
  
  // Primero obtener la imagen actual del especialista
  connection.query(
    'SELECT imagen FROM especialista WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error al obtener la imagen actual:', error);
        res.status(500).send('Error al obtener la imagen actual');
        connection.end();
        return;
      }

      const oldImagePath = results[0]?.imagen;
      
      // Luego actualizar la imagen
      connection.query(
        'UPDATE especialista SET imagen = ? WHERE id = ?',
        [imagePath, id],
        (error, results) => {
          if (error) {
            console.error('Error al actualizar la imagen:', error);
            res.status(500).send('Error al actualizar la imagen');
          } else {
            if (oldImagePath) {
              // Eliminar la imagen anterior del servidor
              fs.unlink(path.join(__dirname, oldImagePath), (err) => {
                if (err) console.error('Error al eliminar la imagen anterior:', err);
              });
            }
            res.status(200).json({
              status: 'success',
              message: 'Imagen actualizada correctamente',
            });
          }
          connection.end();
        }
      );
    }
  );
});

app.get('/', (req, res) => {
  res.send('Hola desde tu primera ruta de la API');
});

app.get('/paciente', (req, res) => {
  const connection = mysql.createConnection(credentials);
  connection.query('SELECT * FROM paciente', (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(result);
    }
  });
  connection.end();
});

app.post('/crearUsuario', (req, res) => {
  console.log('Valor de req.body:', req.body);
  const connection = mysql.createConnection(credentials);
  
  const { id, nombre, rutPaciente, email, contrasena, telefono } = req.body;

  const saltRounds = 15;

  bcrypt.hash(contrasena, saltRounds, (error, hash) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al hashear la contraseña");
    } else {
      connection.query(
        'INSERT INTO paciente (id, nombre, rutPaciente, email, contrasena, telefono) VALUES (?, ?, ?, ?, ?, ?)',
        [id, nombre, rutPaciente, email, hash, telefono],
        (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).send('Error al insertar en la base de datos');
          } else {
            res.status(200).json({
              status: 'success',
              message: 'Datos insertados correctamente',
              data: results,
            });
          }
          connection.end(); // Mover connection.end() aquí
        }
      );
    }
  });
});


app.post('/crearEspecialista', (req, res) => {
  console.log('Valor de req.body:', req.body);
  const connection = mysql.createConnection(credentials);
  const { id, nombre, contacto, horarioAtencion, correo, especialidad, rutEspecialista } = req.body;
  connection.query(
    'INSERT INTO especialista (id, nombre, contacto, horarioAtencion, correo, especialidad, rutEspecialista) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, nombre, contacto, horarioAtencion, correo, especialidad, rutEspecialista],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al insertar en la base de datos');
      } else {
        res.status(200).json({
          status: 'success',
          message: 'Datos insertados correctamente',
          data: results,
        });
      }
    }
  );
  connection.end();
});

app.get('/listarEspecialistas', (req, res) => {
  const connection = mysql.createConnection(credentials);
  connection.connect(error => {
    if (error) {
      console.error('Error connecting to the database:', error);
      res.status(500).send('Error connecting to the database');
      return;
    }
    connection.query('SELECT * FROM especialista', (error, results) => {
      if (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Error querying the database');
      } else {
        res.status(200).json(results);
      }
      connection.end();
    });
  });
});

app.get('/especialista/:id', (req, res) => {
  const { id } = req.params;
  const connection = mysql.createConnection(credentials);

  connection.query('SELECT * FROM especialista WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error en el servidor');
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send('Especialista no encontrado');
      }
    }
    connection.end();  // Asegúrate de cerrar la conexión
  });
});

app.put('/modificarEspecialista/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, rut, contacto, horarioAtencion, correo, especialidad } = req.body;
  const connection = mysql.createConnection(credentials);

  connection.query(
    'UPDATE especialista SET nombre = ?, rutEspecialista = ?, contacto = ?, horarioAtencion = ?, correo = ?, especialidad = ? WHERE id = ?',
    [nombre, rut, contacto, horarioAtencion, correo, especialidad, id],
    (error, results) => {
      if (error) {
        console.error('Error al modificar el especialista:', error);
        res.status(500).send('Error al modificar el especialista');
      } else {
        if (results.affectedRows === 0) {
          res.status(404).send('Especialista no encontrado');
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Especialista modificado correctamente',
          });
        }
      }
    }
  );

  connection.end();
});

app.post('/verificar-especialista', (req, res) => {
  const { rutPaciente } = req.body;
  const connection = mysql.createConnection(credentials);

  connection.query(
    'SELECT id FROM especialista WHERE rutEspecialista = ?',
    [rutPaciente],
    (error, results) => {
      if (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).send('Error al consultar la base de datos');
      } else {
        if (results.length > 0) {
          // Si el RUT pertenece a un especialista, devolver el id del especialista
          const idEspecialista = results[0].id;
          res.status(200).json({ isEspecialista: true, idEspecialista });
        } else {
          // No se encontró un especialista con el RUT proporcionado
          res.status(200).json({ isEspecialista: false });
        }
      }
      connection.end();
    }
  );
});


app.delete('/eliminarEspecialista/:id', (req, res) => {
  const connection = mysql.createConnection(credentials);
  const { id } = req.params;
  
  // Primero obtener la imagen del especialista
  connection.query(
    'SELECT imagen FROM especialista WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error al obtener la imagen del especialista:', error);
        res.status(500).send('Error al obtener la imagen del especialista');
        connection.end();
        return;
      }

      const imagePath = results[0]?.imagen;
      
      // Luego eliminar el especialista
      connection.query(
        'DELETE FROM especialista WHERE id = ?',
        [id],
        (error, results) => {
          if (error) {
            console.error('Error al eliminar el especialista:', error);
            res.status(500).send('Error al eliminar el especialista');
          } else {
            if (imagePath) {
              // Eliminar la imagen del servidor
              fs.unlink(path.join(__dirname, imagePath), (err) => {
                if (err) console.error('Error al eliminar la imagen del especialista:', err);
              });
            }
            res.status(200).json({
              status: 'success',
              message: 'Especialista eliminado correctamente',
            });
          }
          connection.end();
        }
      );
    }
  );
});

app.post('/verificar-login', bodyParser.json(), (req, res) => {
  const { rutPaciente, contrasena } = req.body;
  const connection = mysql.createConnection(credentials);

  // Realiza la consulta a la base de datos
  connection.query(
    'SELECT * FROM paciente WHERE rutPaciente = ?',
    [rutPaciente],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al consultar la base de datos');
      } else {
        if (results.length > 0) {
          const hash = results[0].contrasena;

          bcrypt.compare(contrasena, hash, (error, isMatch) => {
            if (error) {
              console.error(error);
              res.status(500).send('Error al comparar contraseñas');
            } else {
              if (isMatch) {
                // Las contraseñas coinciden, devolver el nombre del paciente
                const rutPaciente = results[0].rutPaciente; // Asumiendo que el nombre está en la columna 'nombre'
                res.status(200).json({ success: true, rutPaciente });
              } else {
                // Las contraseñas no coinciden
                res.status(200).json({ success: false });
              }
            }
          });
        } else {
          // No se encontró un usuario con el email proporcionado
          res.status(200).json({ success: false });
        }
      }
    }
  );

  // Mueve connection.end() a dentro de la callback para asegurar que se llama después de la consulta
  connection.end();
});

app.post('/agendarCita', upload.single('imagen'), (req, res) => {
  console.log('Valor de req.body:', req.body);
  const connection = mysql.createConnection(credentials);
  const { rutPaciente, fecha, hora, descripcion, especialista_id, estado } = req.body;
  const imagen = req.file ? path.join('uploads', req.file.filename) : null;  // Guardar la ruta de la imagen si se ha subido

  connection.query(
    'INSERT INTO cita (rutPaciente, fecha, hora, descripcion, especialista_id, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [rutPaciente, fecha, hora, descripcion, especialista_id, imagen, estado],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al agendar la cita en la base de datos');
      } else {
        res.status(200).json({
          status: 'success',
          message: 'Cita agendada correctamente',
          data: results,
        });
      }
    }
  );
  connection.end();
});


app.get('/misCitas', (req, res) => {
  const connection = mysql.createConnection(credentials);

  connection.query(
    'SELECT * FROM cita',
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al consultar la base de datos');
      } else {
        res.status(200).json(results);
      }
    }
  );

  connection.end();
});

app.put('/citas/:id', (req, res) => {
  const { id } = req.params;
  const { rutPaciente, fecha, hora, descripcion, especialista_id, estado } = req.body;
  const connection = mysql.createConnection(credentials);

  connection.query(
    'UPDATE cita SET rutPaciente = ?, fecha = ?, hora = ?, descripcion = ?, especialista_id = ?, estado = ? WHERE id = ?',
    [rutPaciente, fecha, hora, descripcion, especialista_id, estado, id],
    (error, results) => {
      if (error) {
        console.error('Error al actualizar la cita:', error);
        res.status(500).send('Error al actualizar la cita');
      } else {
        if (results.affectedRows === 0) {
          res.status(404).send('Cita no encontrada');
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Cita actualizada correctamente',
            data: results,
          });
        }
      }
    }
  );
  connection.end();
});

app.delete('/eliminarCita/:id', (req, res) => {
  const connection = mysql.createConnection(credentials);
  const { id } = req.params;
  
  // Primero obtener la imagen asociada con la cita (si existe)
  connection.query(
    'SELECT imagen FROM cita WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error al obtener la imagen de la cita:', error);
        res.status(500).send('Error al obtener la imagen de la cita');
        connection.end();
        return;
      }

      const imagePath = results[0]?.imagen;
      
      // Luego eliminar la cita
      connection.query(
        'DELETE FROM cita WHERE id = ?',
        [id],
        (error, results) => {
          if (error) {
            console.error('Error al eliminar la cita:', error);
            res.status(500).send('Error al eliminar la cita');
          } else {
            if (imagePath) {
              // Eliminar la imagen del servidor
              fs.unlink(path.join(__dirname, imagePath), (err) => {
                if (err) console.error('Error al eliminar la imagen de la cita:', err);
              });
            }
            res.status(200).json({
              status: 'success',
              message: 'Cita eliminada correctamente',
            });
          }
          connection.end();
        }
      );
    }
  );
});


app.listen(4000, () => console.log('Hola, soy el servidor'));
