const ApiError = require("../utils/ApiError");

const errorMiddleware = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;

    let message = err.message || "Internal Server Error";

    if(err instanceof ApiError){
        statusCode = err.statusCode;
        message = err.message;
    }

    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });

};

module.exports = errorMiddleware;