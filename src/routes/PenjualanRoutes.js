const express = require("express");
const {
  createPenjualan,
  getAllPenjualan,
  getPenjualanById,
  updatePenjualan,
  deletePenjualan,
} = require("../controllers/PenjualanControllers");
const { authenticateJWT } = require("../middlewares/jwt");
const router = express.Router();

/**
 * @swagger
 * /penjualan:
 *   post:
 *     summary: Create a new sale
 *     tags: [Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - pelanggan_id
 *               - tanggal_penjualan
 *               - total
 *             properties:
 *               pelanggan_id:
 *                 type: integer
 *                 example: 1
 *               tanggal_penjualan:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T00:00:00Z"
 *               total:
 *                 type: number
 *                 example: 100000
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/penjualan", authenticateJWT, createPenjualan);

/**
 * @swagger
 * /penjualan:
 *   get:
 *     summary: Get all sales
 *     tags: [Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     responses:
 *       200:
 *         description: List of all sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   pelanggan_id:
 *                     type: integer
 *                   tanggal_penjualan:
 *                     type: string
 *                     format: date-time
 *                   total:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/penjualan", authenticateJWT, getAllPenjualan);

/**
 * @swagger
 * /penjualan/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags: [Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.get("/penjualan/:id", authenticateJWT, getPenjualanById);

/**
 * @swagger
 * /penjualan/{id}:
 *   put:
 *     summary: Update sale by ID
 *     tags: [Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               pelanggan_id:
 *                 type: integer
 *               tanggal_penjualan:
 *                 type: string
 *                 format: date-time
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.put("/penjualan/:id", authenticateJWT, updatePenjualan);

/**
 * @swagger
 * /penjualan/{id}:
 *   delete:
 *     summary: Delete sale by ID
 *     tags: [Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.delete("/penjualan/:id", authenticateJWT, deletePenjualan);

module.exports = router;

