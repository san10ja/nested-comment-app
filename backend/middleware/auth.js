import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.user || !decoded.user.id) {
        return res.status(401).json({ message: "Token is invalid or malformed." });
    }

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid." });
  }
};

export default authMiddleware;