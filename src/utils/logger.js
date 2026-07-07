const logger = (...data)=>{
    console.log(
        new Date().toISOString(),
        ...data
    );
}

module.exports = logger;