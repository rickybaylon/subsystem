var express = require('express');
var router = express.Router();
var md = require('../fk/middleware');

/* GET users listing with CRUD */
router.get('/', md.loginRequired, function(req, res, next) {
  fk = req.app.get('fk');
  res.json({message: 'Get all users api', users: fk.data.Users});
})
.get(
  '/:id(\\d+)', md.loginRequired, md.getUser, function(req, res){
    res.json(req.user);
  }
).post(
  '/new', md.loginRequired, md.validateInput, function(req, res){
    fk = req.app.get('fk');
    lm = req.app.get('lm');
    fkuser = req.body;
    fkuser.password = lm.genPasswordHash(fkuser.password);
    fk.addUser(fkuser);
    res.status(201).json({added: fkuser})
  }
).put(
  '/:id(\\d+)', md.loginRequired, md.getUser, md.validateInput, function(req, res){
    fk = req.app.get('fk');
    fkuser = req.body;
    fkuser.password = lm.genPasswordHash(fkuser.password);
    fk.updateUser(req.params.id, fkuser);
    res.json({updated: fk.data.Users[req.params.id]});
  } 
).delete(
  '/:id(\\d+)', md.loginRequired, md.getUser,  function(req, res){
    fk = req.app.get('fk');
    fk.rmUser(req.params.id);
    res.json({deleted: req.user});
  } 
);

router.get('/login', md.checkPassword, function (req, res){
  lm = req.app.get('lm');
  token = lm.genToken(req.username);
  res.json({token: token});
});


module.exports = router;
