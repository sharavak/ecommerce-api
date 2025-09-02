import mongoose from "mongoose";
import Cart from "./Cart.js";
const ProductSchema = new mongoose.Schema({
	name: {
		required: true,
		type: String,
		trim: true,
	},
	brand: {
		required: true,
		type: String,
	},
	category: {
		required: true,
		type: String,
	},
	price: {
		type: Number,
		required: true,
		min: 1,
	},
	stock: {
		type: Number,
		default: 0,
		min: 0,
	},
	images: {
		type: Array,
		default: [],
	},
	status: {
		type: String,
		enum: ["In Stock", "Out of Stock"],
		default: "In Stock",
	},
});

ProductSchema.methods.updateCart = async function () {
	let carts = await Cart.find({"products.productId": this._id});
	for (let c of carts) {
		let recalculatedPrice = 0;
		for (let p of c.products) {
			recalculatedPrice += p.quantity * this.price;
			if (this.stock === 0) p.message = "Out of Stock";
			else if (this.stock < p.quantity) p.message = "Insufficient Stock";
			else if (this.stock > p.quantity) p.message = "In Stock";
		}
		c.totalAmount = recalculatedPrice;
		await c.save();
	}
};

ProductSchema.post("findOneAndUpdate", async function (doc) {
	if (doc && doc.stock <= 0) {
		doc.status = "Out of Stock";
		doc.stock = 0;
		await doc.save();
	}
});

export default mongoose.model("Product", ProductSchema);
