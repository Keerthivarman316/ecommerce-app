const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if(err.code === 'P2025'){
        return res.status(404).json({ error: 'Database record not found.'});
    }
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error', ...(process.env.NODE.env === 'development' && {stack: err.stack})
    });
};
module.exports = errorHandler;