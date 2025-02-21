const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { validateToken } = require('../utils/Token.utils');

const Authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Token is required');
        }

        try {
            const decoded = validateToken(token);
            req.user = decoded.userid;
            next();
        } catch (error) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = Authentication;