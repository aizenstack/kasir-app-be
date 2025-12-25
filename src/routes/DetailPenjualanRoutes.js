const express = require("express");
const {
  createDetailPenjualan,
  getAllDetailPenjualan,
  getDetailPenjualanById,
  getDetailPenjualanByPenjualanId,
  updateDetailPenjualan,
  deleteDetailPenjualan,
} = require("../controllers/DetailPenjualanControllers");
const { authenticateJWT } = require("../middlewares/jwt");
const router = express.Router();

/**
 * @swagger
 * /detail-penjualan:
 *   post:
 *     summary: Create a new sale detail
 *     tags: [Detail Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - penjualan_id
 *               - produk_id
 *               - jumlah
 *               - subtotal
 *             properties:
 *               penjualan_id:
 *                 type: integer
 *                 example: 1
 *               produk_id:
 *                 type: integer
 *                 example: 1
 *               jumlah:
 *                 type: integer
 *                 example: 2
 *               subtotal:
 *                 type: number
 *                 example: 100000
 *     responses:
 *       201:
 *         description: Sale detail created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/detail-penjualan", authenticateJWT, createDetailPenjualan);

/**
 * @swagger
 * /detail-penjualan:
 *   get:
 *     summary: Get all sale details
 *     tags: [Detail Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     responses:
 *       200:
 *         description: List of all sale details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   penjualan_id:
 *                     type: integer
 *                   produk_id:
 *                     type: integer
 *                   jumlah:
 *                     type: integer
 *                   subtotal:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/detail-penjualan", authenticateJWT, getAllDetailPenjualan);

/**
 * @swagger
 * /detail-penjualan/{id}:
 *   get:
 *     summary: Get sale detail by ID
 *     tags: [Detail Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale detail ID
 *     responses:
 *       200:
 *         description: Sale detail details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale detail not found
 *       500:
 *         description: Internal server error
 */
router.get("/detail-penjualan/:id", authenticateJWT, getDetailPenjualanById);

/**
 * @swagger
 * /detail-penjualan/penjualan/{penjualan_id}:
 *   get:
 *     summary: Get sale details by sale ID
 *     tags: [Detail Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: penjualan_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: List of sale details for the specified sale
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.get("/detail-penjualan/penjualan/:penjualan_id", authenticateJWT, getDetailPenjualanByPenjualanId);

/**
 * @swagger
 * /detail-penjualan/{id}:
 *   put:
 *     summary: Update sale detail by ID
 *     tags: [Detail Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               penjualan_id:
 *                 type: integer
 *               produk_id:
 *                 type: integer
 *               jumlah:
 *                 type: integer
 *               subtotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sale detail updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale detail not found
 *       500:
 *         description: Internal server error
 */
router.put("/detail-penjualan/:id", authenticateJWT, updateDetailPenjualan);

/**
 * @swagger
 * /detail-penjualan/{id}:
 *   delete:
 *     summary: Delete sale detail by ID
 *     tags: [Detail Penjualan]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale detail ID
 *     responses:
 *       200:
 *         description: Sale detail deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale detail not found
 *       500:
 *         description: Internal server error
 */
router.delete("/detail-penjualan/:id", authenticateJWT, deleteDetailPenjualan);

module.exports = router;

