const dotenv = require("dotenv");

dotenv.config();
const jwt = require("jsonwebtoken");
const prisma = require("../utils/client");

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

// exports.generateTokens = (user) => {
//   const accessToken = jwt.sign(
//     { id: user.id, username: user.username, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } // Default 24 hours for development
//   );

//   const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
//   });

//   return { accessToken, refreshToken };
// };

exports.generateTokens = async (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }

  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: refreshExpiresIn }
  );

  let expiresAt = new Date();
  if (refreshExpiresIn.endsWith('d')) {
    expiresAt.setDate(expiresAt.getDate() + parseInt(refreshExpiresIn));
  } else if (refreshExpiresIn.endsWith('h')) {
    expiresAt.setHours(expiresAt.getHours() + parseInt(refreshExpiresIn));
  } else if (refreshExpiresIn.endsWith('m')) {
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(refreshExpiresIn));
  } else {
    expiresAt.setDate(expiresAt.getDate() + 1);
  }

  // Pastikan prisma client sudah ready
  if (!prisma || !prisma.refreshToken) {
    console.error('Prisma client error: refreshToken model not available');
    console.error('Please run: npm run prisma:generate');
    throw new Error('Prisma client not initialized. Please run: npm run prisma:generate');
  }

  try {
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: expiresAt
      }
    });
  } catch (error) {
    console.error('Error creating refresh token:', error);
    // Jika error karena model tidak ada, beri error yang jelas
    if (error.message && error.message.includes('undefined')) {
      throw new Error('Prisma RefreshToken model not found. Please run: npm run prisma:generate');
    }
    throw error;
  }

  return { accessToken, refreshToken };
};

exports.refreshTokens = async (refreshToken) => {
  try {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!token) {
      throw new Error('Refresh token not found');
    }

    if (token.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: token.id } }).catch(() => {});
      throw new Error('Refresh token has expired');
    }

    const user = token.user;
    const tokens = await exports.generateTokens(user);

    await prisma.refreshToken.delete({ where: { id: token.id } }).catch(() => {});

    return tokens;
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new Error('Invalid or expired refresh token');
    }
    throw error;
  }
};