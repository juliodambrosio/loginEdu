//Token
const jwt = require('jsonwebtoken');
const tokenConfig = {
  expiresIn: '1h',
}

async function signToken(userData) {
    try {
      const token = jwt.sign(userData, process.env.SECRETKEY, tokenConfig);
      return token;
    } catch (error) {
      console.log('Error to generate token: ' + error)
      
    }
  }

  async function isTokenValid(req, res){
    const token = req.header('Authorization');
    if(!token){
      return  res.status(401).json({ message: 'Token is invalid' });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRETKEY);
      return res.status(200).json({message: 'Token is valid'})

    } catch (error) {
      console.log('Error: ' + error);
      return res.status(401).json({ message: 'Token is invalid' });      
    }
  }

  module.exports = { 
    signToken, 
    isTokenValid 
  };