const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`); // Creates a new error object with the requested URL
    res.status(404);
    next(error); // Passes the error to the errorHandler
  };
  
  export default notFound;
  