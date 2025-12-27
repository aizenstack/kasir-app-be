const express = require("express");
const {
  createPelanggan,
  getAllPelanggan,
  getPelangganById,
  updatePelanggan,
  deletePelanggan,
} = require("../controllers/PelangganController");
const { authenticateJWT } = require("../middlewares/jwt");
const router = express.Router();

/**
 * @swagger
 * /pelanggan:
 *   post:
 *     summary: Create a new customer
 *     tags: [Pelanggan]
 *     security:
 *       - OAuth2Password: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Nama pelanggan (required) - juga bisa menggunakan nama_pelanggan
 *                 example: "John Doe"
 *               nama_pelanggan:
 *                 type: string
 *                 description: Nama pelanggan (required) - alternative field name
 *                 example: "John Doe"
 *               alamat:
 *                 type: string
 *                 description: Alamat pelanggan (optional)
 *                 example: "Jl. Contoh No. 123"
 *               telepon:
 *                 type: string
 *                 description: Nomor telepon pelanggan (optional) - juga bisa menggunakan no_telp
 *                 example: "081234567890"
 *               no_telp:
 *                 type: string
 *                 description: Nomor telepon pelanggan (optional) - alternative field name
 *                 example: "081234567890"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/pelanggan", authenticateJWT, createPelanggan);

/**
 * @swagger
 * /pelanggan:
 *   get:
 *     summary: Get all customers
 *     tags: [Pelanggan]
 *     security:
 *       - OAuth2Password: []
 *     responses:
 *       200:
 *         description: List of all customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nama_pelanggan:
 *                     type: string
 *                   alamat:
 *                     type: string
 *                   telepon:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/pelanggan", authenticateJWT, getAllPelanggan);

/**
 * @swagger
 * /pelanggan/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Pelanggan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.get("/pelanggan/:id", authenticateJWT, getPelangganById);

/**
 * @swagger
 * /pelanggan/{id}:
 *   put:
 *     summary: Update customer by ID
 *     tags: [Pelanggan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               alamat:
 *                 type: string
 *               no_telp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.put("/pelanggan/:id", authenticateJWT, updatePelanggan);

/**
 * @swagger
 * /pelanggan/{id}:
 *   delete:
 *     summary: Delete customer by ID
 *     tags: [Pelanggan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.delete("/pelanggan/:id", authenticateJWT, deletePelanggan);

module.exports = router;

