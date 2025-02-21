const jwt = require("jsonwebtoken")

exports.generatoken = (user,expire='1d')=>{
    const token = jwt.sign({userid:user._id},process.env.JWT_AUTH,{
        expiresIn:expire
    })
    return token
}


exports.validateToken = (token)=>{
    const decoded = jwt.verify(token,process.env.JWT_AUTH)
    return decoded
}