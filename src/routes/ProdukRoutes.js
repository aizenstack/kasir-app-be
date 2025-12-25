const express = require("express");
const {
  createProduk,
  getAllProduk,
  getProdukById,
  updateProduk,
  deleteProduk,
} = require("../controllers/ProdukControllers");
const { authenticateJWT } = require("../middlewares/jwt");
const router = express.Router();

/**
 * @swagger
 * /produk:
 *   post:
 *     summary: Create a new product
 *     tags: [Produk]
 *     security:
 *       - OAuth2Password: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - nama_produk
 *               - harga
 *               - stok
 *             properties:
 *               nama_produk:
 *                 type: string
 *                 example: "Produk A"
 *               harga:
 *                 type: number
 *                 example: 50000
 *               stok:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/produk", authenticateJWT, createProduk);

/**
 * @swagger
 * /produk:
 *   get:
 *     summary: Get all products
 *     tags: [Produk]
 *     security:
 *       - OAuth2Password: []
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nama_produk:
 *                     type: string
 *                   harga:
 *                     type: number
 *                   stok:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/produk", authenticateJWT, getAllProduk);

/**
 * @swagger
 * /produk/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Produk]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/produk/:id", authenticateJWT, getProdukById);

/**
 * @swagger
 * /produk/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Produk]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nama_produk:
 *                 type: string
 *               harga:
 *                 type: number
 *               stok:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/produk/:id", authenticateJWT, updateProduk);

/**
 * @swagger
 * /produk/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Produk]
 *     security:
 *       - OAuth2Password: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/produk/:id", authenticateJWT, deleteProduk);

module.exports = router;

