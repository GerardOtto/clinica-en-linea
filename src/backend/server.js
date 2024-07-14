const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const credentials = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pacientesclinica',
};

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

app.post('/crear', (req, res) => {
  console.log('Valor de req.body:', req.body);
  const connection = mysql.createConnection(credentials);
  const { id, nombre, email, contrasena, telefono } = req.body;

  const saltRounds = 15;

  bcrypt.hash(contrasena, saltRounds, (error, hash) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al hashear la contraseña");
    } else {
      connection.query(
        'INSERT INTO paciente (id, nombre, email, contrasena, telefono) VALUES (?, ?, ?, ?, ?)',
        [id, nombre, email, hash, telefono],
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
    }
  });
});

app.post('/verificar-login', bodyParser.json(), (req, res) => {
  const { email, contrasena } = req.body;
  const connection = mysql.createConnection(credentials);

  // Realiza la consulta a la base de datos
  connection.query(
    'SELECT * FROM paciente WHERE email = ?',
    [email],
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
                // Las contraseñas coinciden
                res.status(200).json({ success: true });
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


  connection.end();
});

app.listen(4000, () => console.log('Hola, soy el servidor'));
