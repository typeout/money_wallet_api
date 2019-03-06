const jwt = require('jsonwebtoken');
const jwtKey = require('../config/keys').jwtKey;

module.exports = {
  verifyToken: (req, res, next) => {
    // get auth header -> send the token in the header
    const bearerHeader = req.headers['authorization'];
    //token will be formatted following:
    // authorization: Bearer <token>
    //1st check if bearer is undifined
    if (typeof bearerHeader !== 'undefined') {
      //get just the token from the bearerHeader 
      // .split it at the space (Bearer <token>)
      const bearer = bearerHeader.split(' ');
      // now retrieving token from the array that came from splitting bearerHeader
      const bearerToken = bearer[1];
      // set the token
      //req.token = bearerToken;
  
      //verify token formating
      if (bearer[0] === 'bearer') {
        //verify token
        jwt.verify(bearerToken, jwtKey, (err, authData) => {
          if (err) {
            res.sendStatus(403);
          } else {
            req.authData = authData;
            //calling next 
            next();
          }
        });
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(403);
    }
  }
}