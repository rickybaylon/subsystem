var express = require('express');
var router = express.Router();
var md = require('../mylib/middleware');

/* GET users listing with CRUD */
var role = "admin";
router.get('/', md.loginRequired(role), function(req, res, next) {
  ap = req.app.get('ap');
  res.json({message: 'Get all users api', users: ap.data.Users});
})
.get(
  '/:id(\\d+)', md.loginRequired, md.getUser, function(req, res){
    res.json(req.user);
  }
).post(
  '/new', md.loginRequired(role), md.validateInput, function(req, res){
    ap = req.app.get('ap');
    lm = req.app.get('lm');
    apuser = req.body;
    apuser.password = lm.genPasswordHash(apuser.password);
    ap.addUser(apuser);
    res.status(201).json({added: apuser})
  }
).put(
  '/:id(\\d+)', md.loginRequired(role), md.getUser, md.validateInput, function(req, res){
    ap = req.app.get('ap');
    apuser = req.body;
    apuser.password = lm.genPasswordHash(apuser.password);
    ap.updateUser(req.params.id, apuser);
    res.json({updated: ap.data.Users[req.params.id]});
  } 
).delete(
  '/:id(\\d+)', md.loginRequired(role), md.getUser,  function(req, res){
    ap = req.app.get('ap');
    ap.rmUser(req.params.id);
    res.json({deleted: req.user});
  } 
);

router.get('/login', md.checkPassword, function (req, res){
  lm = req.app.get('lm');
  token = lm.genToken(req.username);
  res.json({token: token});
});


module.exports = router;
