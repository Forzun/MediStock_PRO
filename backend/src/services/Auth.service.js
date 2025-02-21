const httpStatus = require("http-status")
const { UserModel, ProfileModel } = require("../models")
const ApiError = require("../utils/ApiError")
const { generatoken } = require("../utils/Token.utils")
const axios = require("axios");

class AuthService {
    static async RegisterUser(body) {
        try {
            const { email, password, name, token } = body

            // Check if user exists first
            const checkExist = await UserModel.findOne({ email })
            if (checkExist) {
                throw new ApiError(409, "User Already Registered")
            }

            // Optional reCAPTCHA verification
            if (token && process.env.CAPTCHA_SCREATE_KEY) {
                try {
                    const response = await axios.post(
                        'https://www.google.com/recaptcha/api/siteverify',
                        null,
                        {
                            params: {
                                secret: process.env.CAPTCHA_SCREATE_KEY,
                                response: token,
                            }
                        }
                    );

                    if (!response.data.success) {
                        throw new ApiError(400, "Invalid CAPTCHA verification");
                    }
                } catch (error) {
                    throw new ApiError(400, "CAPTCHA verification failed");
                }
            }

            // Create user
            const user = await UserModel.create({
                email, 
                password, 
                name
            })

            // Generate tokens
            const authToken = generatoken(user)
            const refresh_token = generatoken(user, '2d')
            
            // Create profile
            await ProfileModel.create({
                user: user._id,
                refresh_token
            })

            return {
                success: true,
                statusCode: 201,
                msg: "User Registered Successfully",
                token: authToken
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            console.error('Registration error:', error);
            throw new ApiError(500, "Error registering user");
        }
    }

    static async LoginUser(body) {
        try {
            const { email, password } = body;

            // Find user
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
            }

            // Verify password
            if (password !== user.password) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Credentials");
            }

            // Generate token using the same method as registration
            const token = generatoken(user);

            return {
                success: true,
                msg: "User Login Successfully",
                token: token,
                user: {
                    name: user.name,
                    email: user.email
                }
            };
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Login failed");
        }
    }

    static async ProfileService(user) {
        const checkExist = await UserModel.findById(user).select("name email")
        if (!checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "User Not Regisrered")
            return
        }

        return {
            msg: "Data fetched",
            user: checkExist
        }
    }
}

module.exports = AuthService