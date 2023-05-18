var express = require('express');
var router = express.Router();
var md = require('../mylib/middleware');

/* GET users listing with CRUD */
var role = "admin";
var schema_type = 'Tokens';
router.get('/', md.loginRequired(role), function(req, res, next) {
  ap = req.app.get('ap');
  res.json({message: 'Get all tokens api', tokens: ap.data.Tokens});
})
.get(
  '/:id(\\d+)', md.loginRequired(role), function(req, res){
    ap = req.app.get('ap');
    token = ap.getToken(req.params.id)
    if(typeof token === 'undefined'){
      res.status(404).json({message: `Resource ${req.params.id} not found.`});
    } else {
      res.json(token);
    }
  }
).post(
  '/new', md.loginRequired(role), function(req, res){
    ap = req.app.get('ap');
    data = req.body;
    if ( typeof data.owner === 'undefined' || typeof data.expiry === 'undefined') { 
      res.status(422).json({message: "Missing owner or expiry parameter!"}); 
    } else {
      userdata = ap.getUserByName(data.owner);
      if (userdata === 'undefined') {
        userdata = {
          username: data.owner,
          password: "cc0401fdb71ca563e47de6eb803954aa983f3d6976c6b84545980ce5f5931138:d677cca1c02c61e2bf8b3574c16853f0",
          role: "consumer"
        };
        ap.addUser(userdata);
      }
      lm = req.app.get('lm');
      token = lm.genToken(data.owner, data.expiry);
      decoded = lm.verifyToken(token);
      newtoken = {
        token: token,
        token_id: decoded.token_id,
        is_active: true,
        owner: data.owner
      };
      ap.addToken(newtoken);
      res.status(201).json({added: newtoken});
    }
  }
).put(
  '/:id(\\d+)', md.loginRequired(role), md.validateInput(schema_type), function(req, res){
    ap = req.app.get('ap');
    tokendata = req.body;
    ap.updateToken(req.params.id, tokendata);
    res.json({updated: ap.data.Tokens[req.params.id]});
  } 
).delete(
  '/:id(\\d+)', md.loginRequired(role), function(req, res){
    ap = req.app.get('ap');
    rmtoken = ap.getToken(req.params.id);
    ap.rmToken(req.params.id);
    res.json({deleted: rmtoken});
  } 
);

module.exports = router;
