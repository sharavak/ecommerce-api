/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user cart
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: User cart
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 68b548c57807d6721bcbbee8
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update cart item
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated
 *
 *   delete:
 *     summary: Remove item from cart
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed
 */

import * as cartController from "../controllers/cartController.js";
import express from "express";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware.isAuth, cartController.listAllCarts);
router.post("/", authMiddleware.isAuth, cartController.createCart);
router.delete("/:id", authMiddleware.isAuth, cartController.deleteCart);
router.put("/:id", authMiddleware.isAuth, cartController.updateCart);

export default router;
