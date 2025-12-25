const express = require('express')
const {
  register,
  login,
  oauth2Token,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/AuthControllers')
const { authenticateJWT } = require('../middlewares/jwt');
const { isAdmin } = require('../middlewares/isAdmin');
const router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security:
 *       - OAuth2Password: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "petugas1"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Bad request (missing fields or username exists)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       500:
 *         description: Internal server error
 */
router.post('/auth/register', authenticateJWT, isAdmin, register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login berhasil"
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request (missing fields)
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/auth/login', login)

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: OAuth2 Token endpoint (for Swagger OAuth2 flow)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - grant_type
 *               - username
 *               - password
 *             properties:
 *               grant_type:
 *                 type: string
 *                 example: "password"
 *               username:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Token issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                   example: "bearer"
 *                 expires_in:
 *                   type: integer
 *                   example: 86400
 *                 refresh_token:
 *                   type: string
 *                 scope:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/auth/token', oauth2Token)

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Authentication]
 *     security:
 *       - OAuth2Password: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [administrator, petugas]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/auth/users', authenticateJWT, isAdmin, getAllUsers)

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Authentication]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [administrator, petugas]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/auth/users/:id', authenticateJWT, isAdmin, getUserById)

/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Authentication]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newusername"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newpassword123"
 *               role:
 *                 type: string
 *                 enum: [administrator, petugas]
 *                 example: "petugas"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request (invalid ID, username exists, invalid role, or no fields provided)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/auth/users/:id', authenticateJWT, isAdmin, updateUser)

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Authentication]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       400:
 *         description: Bad request (invalid ID or trying to delete own account)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/auth/users/:id', authenticateJWT, isAdmin, deleteUser)

module.exports = router;