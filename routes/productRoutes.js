/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /api/products/new:
 *   post:
 *     summary: Create a new product (Admin only)
 *     description: Add a new product to the store. Requires admin privileges.
 *     security:
 *       - bearerAuth: []
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pa
 *               brand:
 *                 type: string
 *                 example: Dell
 *               category:
 *                 type: string
 *                 example: Laptop
 *               price:
 *                 type: number
 *                 example: 50000
 *               stock:
 *                 type: number
 *                 example: 5
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg"]
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       403:
 *         description: Forbidden (not an admin)
 */

/**
 * @swagger
 * /api/products/edit/{id}:
 *   put:
 *     summary: Update a product.(Admin only)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: available
 *               req:
 *                 type: string
 *                 example: details
 *     responses:
 *       200:
 *         description: Product updated
 */

/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     summary: Delete a product.(Admin only)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 */

import express from "express";
import * as productController from "../controllers/productControllers.js";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", productController.allProducts);
router.post(
	"/new",
	authMiddleware.isAuth,
	authMiddleware.isAdmin,
	productController.createProduct
);
router.put("/edit/:id", productController.editProduct);
router.delete("/delete/:id", productController.deleteProduct);
router.get("/query", productController.filterProducts);

export default router;
