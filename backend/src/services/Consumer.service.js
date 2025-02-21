const httpStatus = require("http-status")
const { ConsumerModel, OrdersModel } = require("../models")
const ApiError = require("../utils/ApiError")
class ConsumerService{


    static async RegisterConsumer(userId, body) {
        try {
            const { email } = body;

            // Check if consumer exists
            const exists = await ConsumerModel.findOne({ email, createdBy: userId });
            if (exists) {
                throw new ApiError(409, "Consumer already exists");
            }

            // Create consumer
            const consumer = await ConsumerModel.create({
                ...body,
                createdBy: userId
            });

            return {
                success: true,
                statusCode: 201,
                msg: "Consumer registered successfully",
                consumer
            };
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Error registering consumer");
        }
    }

    static async DeleteConsumer(user,id){
         

        const checkExist = await ConsumerModel.findOneAndDelete({_id:id,user:user});

        if(!checkExist){
            throw new ApiError(httpStatus.BAD_REQUEST,"Consumer Not Found in Record");
            return
        }

                await OrdersModel.deleteMany({consumer:id})
                

            return {
                msg:"Consumer Deleted :)"
            }

        
    }
    static async getById(userId, consumerId) {
        try {
            const consumer = await ConsumerModel.findOne({
                _id: consumerId,
                createdBy: userId
            });

            if (!consumer) {
                throw new ApiError(404, "Consumer not found");
            }

            return {
                success: true,
                statusCode: 200,
                msg: "Consumer fetched successfully",
                consumer
            };
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Error fetching consumer");
        }
    }

    

    static async GetAllUser(userId, page = 1, query = "") {
        try {
            const limit = 10;
            const skip = (page - 1) * limit;

            const filter = {
                createdBy: userId,
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { email: { $regex: query, $options: "i" } }
                ]
            };

            const consumers = await ConsumerModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await ConsumerModel.countDocuments(filter);

            return {
                success: true,
                statusCode: 200,
                msg: "Consumers fetched successfully",
                consumers,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    current: page,
                    perPage: limit
                }
            };
        } catch (error) {
            throw new ApiError(500, "Error fetching consumers");
        }
    }
    
    static async updateById(user,body,id){
        
        const {name,email,mobile,dob,address} = body

        const checkExist = await ConsumerModel.findById({_id:id});

        if(checkExist.email !==email){

        const checkExistEmail = await ConsumerModel.findOne({email:email,user:user});

        if(checkExistEmail){
            throw new ApiError(httpStatus.BAD_REQUEST,"Consumer Email Already in Another Record ");
            return
        } 
        }

            await ConsumerModel.findByIdAndUpdate(id,{
                name,email,mobile,dob,address,user
            })

            return {
                msg:"Consumer Update :)"
            }

        
    }

     static async GetUserForSearch(user){ 

                


       const data =  await ConsumerModel.find({user}).select("name dob")
                 
       ;

        //total document 

 


            return {
                users:data 
            }




    }
     static async DashboardData(user){ 

                


       const consumers =  await ConsumerModel.countDocuments({user})
       const orders =  await OrdersModel.find({user}).select("items.price -_id") 
                 
       ;
         const arr =await  orders.map((cur)=>{
    // console.log();
    return [...cur.items.map((c)=>c.price)]
  })

    //    let sale =0

    //    for (let index = 0; index < array.length; index++) {
    //     const element = array[index];
        
    //    }

        //total document 

 


            return {
                consumers,
                 orders:orders.length,
                 sell:arr.length>0 ?arr.flat(2).reduce((a,c)=>a+c):arr
            }




    }
    

    
}

module.exports = ConsumerService