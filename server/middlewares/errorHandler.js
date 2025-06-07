import dotenv from 'dotenv';
dotenv.config();
// Error handling middleware for Express.js applications
// This middleware captures errors thrown in the application and formats the response
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Logs the full error stack in your terminal (useful for debugging)
  
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
    res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // hides stack trace in production
    });
  };
  
  export default errorHandler;
  