const ErrorHandling = (err, req, res, next) => {
    try {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';

        console.error('Error:', {
            statusCode,
            message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });

        res.status(statusCode).json({
            success: false,
            statusCode,
            message
        });
        
    } catch (error) {
        console.error('Error in error handler:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Internal Server Error"
        });
    }
}

module.exports = ErrorHandling;