const jwt = require('jsonwebtoken');

const jwtMiddleWare = (req,res,next)=>{
    const  token  = req.headers.authorization.split(' ')[1];

    if(!token) return res.status(401).json({error : "UnAuthorized"});

    try{
       const decoded =  jwt.verify(token,process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
    }catch(err){
        res.status(401).json({err:"Invalid Token"});
    }
}

// Function to generate token
const generateToken = (userData) =>{
    return jwt.sign(userData,process.env.JWT_SECRET);
}

module.exports = {jwtMiddleWare,generateToken};