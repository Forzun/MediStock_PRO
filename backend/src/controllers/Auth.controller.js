const httpStatus = require("http-status");
const AuthService = require("../services/Auth.service")
const CatchAsync = require("../utils/CatchAsync")

class AuthController{
        static RegisterUser = CatchAsync(async(req,res)=>{
            const result = await AuthService.RegisterUser(req.body);
            res.status(result.statusCode || httpStatus.CREATED).json({
                success: true,
                msg: result.msg,
                token: result.token
            });
        }) 
    static LoginUser = CatchAsync(async(req,res)=>{
            const res_obj = await AuthService.LoginUser(req.body);
            res.status(httpStatus.OK).send(res_obj)
        })
          static ProfileController = CatchAsync(async(req,res)=>{
            const res_obj = await AuthService.ProfileService(req.user);
            res.status(httpStatus.OK).send(res_obj)
        })
         
        
}

module.exports = AuthController