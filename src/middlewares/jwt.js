const dotenv = require("dotenv");

dotenv.config();
const jwt = require("jsonwebtoken");

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Missing or invalid Authorization header." });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token not provided." });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token Expired", 
        error: "Please login again to get a new token" 
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: "Invalid Token",
        error: "Token is malformed or invalid"
      });
    }
    console.error("JWT verification error:", error);
    return res.status(403).json({ 
      message: "Invalid or Token Expired",
      error: error.message 
    });
  }
};

exports.authorizeRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } // Default 24 hours for development
  );

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

  return { accessToken, refreshToken };
};
