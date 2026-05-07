import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized: No token provided");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId || !decoded.role) {
      const error = new Error("invalid token payload");
      error.statusCode = 401;
      return next(error);
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    const error = new Error("Invalid token");
    error.statusCode = 401;

    if (err.name === "TokenExpiredError") {
      error.name = "TokenExpiredError";
    }

    return next(error);
  }
};

export default authMiddleware;
