/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all user orders
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *
 *   post:
 *     summary: Create an order from cart
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *                 example: 68b548c57807d6721bcbbee8
 *               paymentMethod:
 *                 type: string
 *                 example: credit_card
 *     responses:
 *       201:
 *         description: Order created
 */

import * as orderController from "../controllers/orderController.js";
import * as authMiddleware from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();
router.get("/", authMiddleware.isAuth, orderController.listAllOrders);
router.post("/", authMiddleware.isAuth, orderController.createOrder);

export default router;
