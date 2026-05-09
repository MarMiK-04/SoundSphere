function adminAuth(req, res, next) {
  const userId = req.userId;
  const userRole = req.userRole;

  if (userRole !== "admin") {
    const error = new Error("Unauthorized user");
    error.statusCode = 403;
    return next(error);
  }
  
  next()

}

export default adminAuth;
