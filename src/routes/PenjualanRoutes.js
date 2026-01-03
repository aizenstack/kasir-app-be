const express = require("express");
const {
  createPenjualan,
  getAllPenjualan,
  getPenjualanById,
  updatePenjualan,
  deletePenjualan,
  downloadNota,
} = require("../controllers/PenjualanControllers");
const { authenticateJWT } = require("../middlewares/jwt");
const router = express.Router();

/**
 * @swagger
 * /penjualan:
 *   post:
 *     summary: Create a new sales
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
 *               - tanggal_penjualan
 *               - detail_penjualan
 *             properties:
 *               tanggal_penjualan:
 *                 type: string
 *                 format: date-time
 *                 description: Tanggal penjualan (required)
 *                 example: "2024-12-27T10:00:00Z"
 *               pelanggan_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID pelanggan (optional, null atau kosong untuk walk-in customer)
 *                 example: 1
 *               detail_penjualan:
 *                 type: array
 *                 minItems: 1
 *                 description: |
 *                   Array of detail penjualan (REQUIRED, minimal 1 item).
 *                   Format: detail_penjualan[0][produk_id]=1&detail_penjualan[0][jumlah_produk]=2
 *                 items:
 *                   type: object
 *                   required:
 *                     - produk_id
 *                     - jumlah_produk
 *                   properties:
 *                     produk_id:
 *                       type: integer
 *                       description: ID produk yang dibeli (harus ada di database)
 *                       example: 1
 *                     jumlah_produk:
 *                       type: integer
 *                       minimum: 1
 *                       description: Jumlah produk yang dibeli (must be > 0, tidak boleh melebihi stok)
 *                       example: 2
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tanggal_penjualan
 *               - detail_penjualan
 *             properties:
 *               tanggal_penjualan:
 *                 type: string
 *                 format: date-time
 *                 description: Tanggal penjualan (required)
 *                 example: "2024-12-27T10:00:00Z"
 *               pelanggan_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID pelanggan (optional, null atau kosong untuk walk-in customer)
 *                 example: 1
 *               detail_penjualan:
 *                 type: array
 *                 minItems: 1
 *                 description: |
 *                   Array of detail penjualan (REQUIRED, minimal 1 item).
 *                   Setiap item harus memiliki produk_id dan jumlah_produk.
 *                   Total harga akan dihitung otomatis berdasarkan harga produk.
 *                 items:
 *                   type: object
 *                   required:
 *                     - produk_id
 *                     - jumlah_produk
 *                   properties:
 *                     produk_id:
 *                       type: integer
 *                       description: ID produk yang dibeli (harus ada di database)
 *                       example: 1
 *                     jumlah_produk:
 *                       type: integer
 *                       minimum: 1
 *                       description: Jumlah produk yang dibeli (must be > 0, tidak boleh melebihi stok)
 *                       example: 2
 *           examples:
 *             singleProduct:
 *               summary: Single product sale
 *               value:
 *                 tanggal_penjualan: "2024-12-27T10:00:00Z"
 *                 pelanggan_id: 1
 *                 detail_penjualan:
 *                   - produk_id: 1
 *                     jumlah_produk: 2
 *             multipleProducts:
 *               summary: Multiple products sale
 *               value:
 *                 tanggal_penjualan: "2024-12-27T10:00:00Z"
 *                 pelanggan_id: 1
 *                 detail_penjualan:
 *                   - produk_id: 1
 *                     jumlah_produk: 2
 *                   - produk_id: 2
 *                     jumlah_produk: 3
 *             walkInCustomer:
 *               summary: Walk-in customer (no pelanggan_id)
 *               value:
 *                 tanggal_penjualan: "2024-12-27T10:00:00Z"
 *                 detail_penjualan:
 *                   - produk_id: 1
 *                     jumlah_produk: 1
 *     responses:
 *       201:
 *         description: Sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Penjualan created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     tanggal_penjualan:
 *                       type: string
 *                       format: date-time
 *                     total_harga:
 *                       type: number
 *                     pelanggan_id:
 *                       type: integer
 *                       nullable: true
 *                     detailPenjualan:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           produk_id:
 *                             type: integer
 *                           jumlah_produk:
 *                             type: integer
 *                           subtotal:
 *                             type: number
 *                           produk:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               nama_produk:
 *                                 type: string
 *                               harga:
 *                                 type: number
 *       400:
 *         description: Bad request (missing required fields, invalid data, or insufficient stock)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "Tanggal penjualan and detail penjualan are required"
 *                     - "Produk ID and jumlah produk are required and jumlah must be greater than 0"
 *                     - "Insufficient stock for produk X. Available: 5, Requested: 10"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Product not found
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
 * /penjualan/{id}/cetak:
 *   get:
 *     summary: Download sale receipt (Nota)
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
 *         description: PDF file of the receipt
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.get("/penjualan/:id/cetak", authenticateJWT, downloadNota);

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

