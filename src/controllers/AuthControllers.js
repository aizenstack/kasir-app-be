const bcrypt = require("bcrypt");
const { generateTokens } = require("../middlewares/jwt");
const {
  createUser,
  findUserByUsername,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../models/AuthModels");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username & Password are required" });
    }

    const existing = await findUserByUsername(username);
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      username,
      password: hashedPassword,
      role: "petugas",
    });
    const tokens = generateTokens(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      tokens,
    });
  } catch (error) {
    console.error("Register error:", error);
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

    const tokens = generateTokens(user);

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
      // Check if username already exists (excluding current user)
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

    // Prevent deleting own account
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

// OAuth2 Token endpoint for Swagger OAuth2 Password flow
exports.oauth2Token = async (req, res) => {
  try {
    const { username, password, grant_type } = req.body;

    // OAuth2 Password flow requires grant_type=password
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

    const tokens = generateTokens(user);
    
    // Calculate expires_in in seconds (default 24h = 86400 seconds)
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    let expiresInSeconds = 86400; // default 24 hours
    if (expiresIn.endsWith('h')) {
      expiresInSeconds = parseInt(expiresIn) * 3600;
    } else if (expiresIn.endsWith('m')) {
      expiresInSeconds = parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('d')) {
      expiresInSeconds = parseInt(expiresIn) * 86400;
    }

    // Return OAuth2 standard format
    return res.status(200).json({
      access_token: tokens.accessToken,
      token_type: 'bearer',
      expires_in: expiresInSeconds,
      refresh_token: tokens.refreshToken,
      scope: user.role
    });
  } catch (error) {
    console.error("OAuth2 token error:", error);
    return res.status(500).json({
      error: 'server_error',
      error_description: 'Internal server error'
    });
  }
};