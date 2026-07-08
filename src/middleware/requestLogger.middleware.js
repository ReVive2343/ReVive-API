const logger = require("../utils/logger");

const requestLogger = (req,res,next)=>{

    logger(
        req.method,
        req.originalUrl
    );

    next();

};

module.exports = requestLogger;