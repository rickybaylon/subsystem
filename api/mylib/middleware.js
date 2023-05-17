function getUser (req, res, next){
    ap = req.app.get('ap');
    apuser = ap.getUser(req.params.id);
    if(typeof apuser === 'undefined'){
      res.status(404).json({message: 'Resource '+req.params.id+' not found.'});
    } else {
      req.user = apuser;
      next();
    }
  }
  
  function validateInput (req, res, next) {
    iv = req.app.get('iv');
    ap = req.app.get('ap');
    if (! req.body){}
    vr = iv.validateUser(req.body);
    if (vr.isOK) {
      usernames = ap.getUserNames();
      if (usernames.includes(req.body.username) && req.method === 'POST'){
        res.status(409).json({message: req.body.username+" username already exist."});
      } else {
        next();
      }
    } else {
      res.status(400).json({message: vr.message});   
    }
  }
  
  function loginRequired(role){
		return function(req, res, next){
    	lm = req.app.get('lm');
    	const token = (req.headers.authorization || '').split(' ')[1] || '';
    	if (token){
      	decoded = lm.verifyToken(token);
      	if (decoded.success) {
					ap = req.app.get('ap');
					userrecord = ap.getUserByName(decoded.authuser);
					if (userrecord.role === role) {
        		req.username = decoded.authuser;
        		next();
					} else {
						res.status(400).json({message: `Access denied for user ${userrecord.username}!`});
					}
      	} else {
        	res.status(400).json(decoded.error);
      	}
    	} else {
      	res.status(400).json({message: "Token required!"});
    	}
  	}
	}
  
  function checkPassword(req, res, next){
    const reqauth = (req.headers.authorization || '').split(' ')[1] || '';
    const [user, passwd] = Buffer.from(reqauth, 'base64').toString().split(':');
    ap = req.app.get('ap');
    lm = req.app.get('lm');
    userrecord = ap.getUserByName(user);
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
