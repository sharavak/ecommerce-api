import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
	try {
		const {cartId} = req.body;
		const user = await User.findOne({email: req.user.email});
		const cart = await Cart.findOne({_id: cartId}).populate(
			"products.productId"
		);

		if (!cart) return res.status(404).json({error: "Cart not found"});

		for (let item of cart.products) {
			if (item.productId.stock < item.quantity) {
				if (item.productId.stock === 0) {
					return res
						.status(400)
						.json({error: `This ${item.productId.name} is out of stock`});
				}
				return res.status(400).json({
					error: `${item.productId.name} has only ${item.productId.stock} items left.Unable to process the order`,
				});
			}
		}

		const purchasedProds = [];
		for (const item of cart.products) {
			const isUpdated = await Product.findOneAndUpdate(
				{
					_id: item.productId._id,
					stock: {$gte: item.quantity},
				},
				{$inc: {stock: -item.quantity}},
				{new: true}
			);
			if (!isUpdated) {
				item.message = "Out of Stock";

				return res.status(400).json({
					error: `This item ${item.productId.name} is currently out of stock or Insuffcient stock`,
				});
			}
			item.message = "Out of Stock";
			purchasedProds.push({
				_id: item.productId._id,
				stock: isUpdated.stock,
				quantity: item.quantity,
			});
		}

		for (let item of purchasedProds) {
			const productId = item._id;
			const remainingStock = item.stock;
			if (remainingStock === 0) {
				await Cart.updateMany(
					{"products.productId": productId, userId: {$ne: user._id}},
					{$set: {"products.$[elem].message": "Out of Stock"}},
					{arrayFilters: [{"elem.productId": productId}]}
				);
			} else {
				await Cart.updateMany(
					{"products.productId": productId, userId: {$ne: user._id}},
					{$set: {"products.$[elem].quantity": remainingStock}},
					{
						arrayFilters: [
							{
								"elem.productId": productId,
								"elem.quantity": {$gt: remainingStock},
							},
						],
					}
				);
			}
		}
		const affectedCarts = await Cart.find({
			"products.productId": {$in: purchasedProds.map((p) => p._id)},
			userId: {$ne: user._id},
		}).populate("products.productId");

		for (let i of affectedCarts) {
			i.totalAmount = i.products.reduce(
				(sum, p) => sum + p.quantity * p.productId.price,
				0
			);
		}

		const order = new Order({
			userId: user._id,
			products: cart.products.map((p) => ({
				productId: p.productId._id || p.productId,
				quantity: p.quantity,
			})),
			totalAmount: cart.totalAmount,
		});
		await Cart.findByIdAndDelete(cartId);

		return res.status(201).json({message: "Order placed successfully", order});
	} catch (e) {
		console.log(e);
		res.status(400).json({error: e});
	}
};

export const listAllOrders = async (req, res) => {
	try {
		const user = await User.findOne({email: req.user.email});
		const order = await Order.find({userId: user._id});
		return res.json(order);
	} catch (e) {
		return res.status(404).json({error: e});
	}
};
export const getOrder = async (req, res) => {
	try {
		const {id} = req.params;
		const order = await Order.findById(id);
		if (!order) {
			return res.status(404).json({error: "Order not found"});
		}
		res.status(200).json(order);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};
