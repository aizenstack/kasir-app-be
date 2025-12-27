const bcrypt = require("bcrypt");
const { generateTokens, refreshTokens } = require("../middlewares/jwt");
const {
  createUser,
  findUserByUsername,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../models/AuthModels");
const prisma = require("../utils/client");

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username & Password are required" });
    }

    // Validasi username
    if (typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ message: "Username must be a non-empty string" });
    }

    const trimmedUsername = username.trim();

    // Validasi password
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    let userRole = "petugas";
    if (role) {
      if (role !== "administrator" && role !== "petugas") {
        return res.status(400).json({
          message: "Invalid role. Role must be 'administrator' or 'petugas'",
        });
      }
      userRole = role;
    }

    const existing = await findUserByUsername(trimmedUsername);
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      username: trimmedUsername,
      password: hashedPassword,
      role: userRole,
    });
    const tokens = await generateTokens(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      tokens,
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username & Password are required" });
    }

    const trimmedUsername = username.trim();
    const user = await findUserByUsername(trimmedUsername);

    if (!user) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }

    const tokens = await generateTokens(user);

    return res.status(200).json({
      message: "Login berhasil",
      tokens,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get user by id error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { username, password, role } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};

    if (username) {
      const userWithUsername = await findUserByUsername(username);
      if (userWithUsername && userWithUsername.id !== userId) {
        return res.status(400).json({ message: "Username already exists" });
      }
      updateData.username = username;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (role) {
      if (role !== "administrator" && role !== "petugas") {
        return res.status(400).json({
          message: "Invalid role. Role must be 'administrator' or 'petugas'",
        });
      }
      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }

    const updatedUser = await updateUser(userId, updateData);

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user && req.user.id === userId) {
      return res.status(400).json({
        message: "Cannot delete your own account",
      });
    }

    await deleteUser(userId);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.oauth2Token = async (req, res) => {
  try {
    const { username, password, grant_type } = req.body;

    if (grant_type !== 'password') {
      return res.status(400).json({
        error: 'unsupported_grant_type',
        error_description: 'Only password grant type is supported'
      });
    }

    if (!username || !password) {
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'Username and password are required'
      });
    }

    const trimmedUsername = username.trim();
    const user = await findUserByUsername(trimmedUsername);

    if (!user) {
      return res.status(401).json({
        error: 'invalid_grant',
        error_description: 'Invalid username or password'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'invalid_grant',
        error_description: 'Invalid username or password'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("OAuth2 Error: JWT_SECRET is not configured");
      return res.status(500).json({
        error: 'server_error',
        error_description: 'JWT_SECRET is not configured. Please check your environment variables.'
      });
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      console.error("OAuth2 Error: JWT_REFRESH_SECRET is not configured");
      return res.status(500).json({
        error: 'server_error',
        error_description: 'JWT_REFRESH_SECRET is not configured. Please check your environment variables.'
      });
    }

    const tokens = await generateTokens(user);

    const expiresIn = process.env.JWT_EXPIRES_IN || "15m";
    let expiresInSeconds = 900; // default 15 minutes
    if (expiresIn.endsWith('h')) {
      expiresInSeconds = parseInt(expiresIn) * 3600;
    } else if (expiresIn.endsWith('m')) {
      expiresInSeconds = parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('d')) {
      expiresInSeconds = parseInt(expiresIn) * 86400;
    }

    return res.status(200).json({
      access_token: tokens.accessToken,
      token_type: 'bearer',
      expires_in: expiresInSeconds,
      refresh_token: tokens.refreshToken,
      scope: user.role
    });
  } catch (error) {
    console.error("OAuth2 token error:", error);
    console.error("Error stack:", error.stack);
    
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    return res.status(500).json({
      error: 'server_error',
      error_description: isDevelopment 
        ? `Internal server error: ${error.message}` 
        : 'Internal server error',
      ...(isDevelopment && { details: error.stack })
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const tokens = await refreshTokens(token);

    return res.status(200).json({
      message: 'Token refreshed successfully',
      tokens
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(401).json({
      message: error.message || 'Invalid refresh token'
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        message: 'Refresh token is required' 
      });
    }
    
    // Cari refresh token di database
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token: token }
    });

    if (refreshTokenRecord) {
      // Hapus refresh token dari database (invalidate)
      await prisma.refreshToken.delete({
        where: { id: refreshTokenRecord.id }
      });
      
      return res.status(200).json({
        message: 'Logout berhasil. Token telah di-invalidate.'
      });
    }

    // Jika token tidak ditemukan, tetap return success
    // (untuk security, tidak reveal apakah token valid atau tidak)
    return res.status(200).json({
      message: 'Logout berhasil'
    });
  } catch (error) {
    console.error('Logout error:', error);
    console.error('Error details:', error.message);
    // Tetap return success untuk security
    return res.status(200).json({
      message: 'Logout berhasil'
    });
  }
};