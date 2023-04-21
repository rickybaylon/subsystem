function getUser (req, res, next){
    fk = req.app.get('fk');
    fkuser = fk.getUser(req.params.id);
    if(typeof fkuser === 'undefined'){
      res.status(404).json({message: 'Resource '+req.params.id+' not found.'});
    } else {
      req.user = fkuser;
      next();
    }
  }
  
  function validateInput (req, res, next) {
    iv = req.app.get('iv');
    fk = req.app.get('fk');
    if (! req.body){}
    vr = iv.validateUser(req.body);
    if (vr.isOK) {
      usernames = fk.getUserNames();
      if (usernames.includes(req.body.username) && req.method === 'POST'){
        res.status(409).json({message: req.body.username+" username already exist."});
      } else {
        next();
      }
    } else {
      res.status(400).json({message: vr.message});   
    }
  }
  
  function loginRequired(req, res, next){
    lm = req.app.get('lm');
    const token = (req.headers.authorization || '').split(' ')[1] || '';
    if (token){
      decoded = lm.verifyToken(token);
      if (decoded.success) {
        req.username = decoded.authuser;
        next();
      } else {
        res.status(400).json(decoded.error);
      }
    } else {
      res.status(400).json({message: "Token required!"});
    }
  }
  
  function checkPassword(req, res, next){
    const reqauth = (req.headers.authorization || '').split(' ')[1] || '';
    const [user, passwd] = Buffer.from(reqauth, 'base64').toString().split(':');
    fk = req.app.get('fk');
    lm = req.app.get('lm');
    userrecord = fk.getUserByName(user);
    if (userrecord){
      if (lm.checkPasswordHash(passwd, userrecord.password)){
        req.username = userrecord.username;
        next();
      } else {
        res.status(400).json({message: "Invalid password."});
      }
    } else {
      res.status(404).json({message: "Invalid user."});
    }
  }

module.exports = { checkPassword, loginRequired, validateInput, getUser };