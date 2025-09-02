import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dotenv from "dotenv";
dotenv.config();

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
const app = express();
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/ecommerce";

mongoose.connect(DB_URL);
mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
	console.log("Error connecting to MongoDB", err);
});

app.use(express.json());

app.get("/", async (req, res) => {
	res.status(200).json({message: "Welcome to the api!!!"});
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.all(/(.*)/, async (req, res) => {
	return res.status(404).json({error: "Request not found!!!"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
	console.log(`Listening on ${PORT}`);
});
// export default app;
