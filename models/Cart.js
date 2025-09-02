import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
				min: 1,
			},
			message: {
				type: String,
				enum: ["In Stock", "Out of Stock", "Insufficient Stock"],
				default: "In Stock",
			},
		},
	],
	totalAmount: {
		type: Number,
		required: true,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("Cart", CartSchema);
