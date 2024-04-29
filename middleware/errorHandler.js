// Custom error handler middleware
function errorHandler(err, req, res, next) {
    // If it's a validation error from Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
  
    // Handle other types of errors if needed
  
    // If it's not a known error type, return a generic 500 error
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
  module.exports = errorHandler;
  