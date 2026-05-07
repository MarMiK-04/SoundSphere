
const errorHandler = (err, req, res, next) => {
  const message = err.message || "Internal server error";
  const statusCode = err.statusCode || 500;

  if (err.name === "ZodError") {
    return res.status(400).json({
      msg: err.message,
      error: err.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      msg: `${field} already exist`,
    });
  }

  if(err.name === "TokenExpiredError"){
    return res.status(401).json({
      msg : `Token expired`
    })
  }

  return res.status(statusCode).json({
    msg: message,
  });
};

export default errorHandler;
