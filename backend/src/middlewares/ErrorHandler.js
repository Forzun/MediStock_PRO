const ApiError = require("../utils/ApiError")

const ErrorHandling = (err, req, res, next) => {
    try {
        // Create response object with default values
        const obj = {
            statusCode: err.statusCode || 500,  // Default to 500 if statusCode is undefined
            message: err.message || "Internal Server Error",
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
        }

        // Log error for debugging
        console.error('Error:', {
            statusCode: obj.statusCode,
            message: obj.message,
            error: err
        });

        // Send response with guaranteed valid status code
        res.status(obj.statusCode).json(obj);
        
    } catch (error) {
        // Fallback error response if something goes wrong in error handling
        console.error('Error in error handler:', error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        });
    }
}

module.exports = ErrorHandling