const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/user.js');


router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) =>{
  db.query(
    `SELECT * FROM users WHERE LOWER(username)=LOWER(${db.escape(req.body.username)});`,
    (err, row)=>{
      if (row.length) {
        return res.status(409).send({
          mensaje: 'Nombre de usuario Esta en uso!'
        });
      }else{
        //nombre de usuario esta disponible
        bcrypt.hash(req.body.password, 10, (err, hash) =>{
          if(err){
            return res.status(500).send({
              mensaje: err
            });
          }else{
            //insertando en la base de datos
            db.query(
              `INSERT INTO users (id, username, password, registered) VALUES('${uuid.v4()}',${db.escape(req.body.username)},${db.escape(hash)},now())`,
              (err, row) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    mensaje: err
                  });
                }
                return res.status(201).send({
                  mensaje:'REGISTRADO'
                });
              }
            )
          }
        })
      }
    }
  )
});
router.post('/login', (req, res, next) =>{
  db.query(
    `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
    (err, row)=>{
      //usuario no existe
      if (err) {
        throw err;
        return res.status(400).send({
          mensaje: err
        });
      }
      if (!row.length) {
        return res.status(401).send({
          mensaje: "Usuario o Contrasena Invalido"
        });
      }
      //verificando contrasena
      bcrypt.compare(
        req.body.password,
        row[0]['password'],
        (bErr, bRow) =>{
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              mensaje: 'Usuario o Contrasena Invalido'
            });
          }
          if (bRow) {
            const token = jwt.sign({
              username:row[0].username,
              userId:row[0].id
            },
            'SECRETKEY',{
              expiresIn: '7d'
            }
            );
            db.query(
              `UPDATE users SET last_login=now() WHERE id = '${row[0].id}'`
            );
            return res.status(200).send({
              mensaje: 'LOGUEADO',
              token,
              user:row[0]
            });
          }
          return res.status(401).send({
            mensaje: 'Usuario o Contrasena Invalido'
          });
        }
      )
    }
  )
});
router.post('/route-proctecty', userMiddleware.isLoggedIn, (req, res, next) =>{
  res.send('ESTE ES CONTENIDO SECRETO SOLO USUARIOS LOGUEDOS PUEDEN VER')
});

module.exports=router;
