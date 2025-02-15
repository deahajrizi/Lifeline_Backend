const errorHandler = (err, req, res) => {
    // Set the status code to the error code if it exists, otherwise set it to 500
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}
module.exports = {
    errorHandler
}