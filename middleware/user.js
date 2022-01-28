const req = require('express/lib/request');
const jwt = require('jsonwebtoken');

module.exports = {
  validateRegister: (req, res, next) =>{
    //nombre de usuarios min 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        mensaje: "Por Favor un nombre de usuario con min 3 caracteres"
      });
    }
    //contrasena min 3
    if (!req.body.password || req.body.password.length <6) {
      return res.status(400).send({
        mensaje: "Por Favor una contrasena con min 6 caracteres"
      });
    }
    //contrasena repetida
    if (!req.body.password_repeat || req.body.password != req.body.password_repeat) {
      return res.status(400).send({
        mensaje: "Ambas Contrasena deben ser iguales"
      });
    }
    next();
  },

  // middleware/users.js

 isLoggedIn: (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(
      token,
      'SECRETKEY'
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}
};
