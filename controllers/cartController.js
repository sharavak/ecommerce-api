import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const createCart = async (req, res) => {
	let {productId, quantity} = req.body;
	try {
		const user = await User.findOne({email: req.user.email});
		const product = await Product.findOne({_id: productId});
		if (!product) return res.status(404).json({error: "Product not found!!!"});
		if (product.stock >= quantity) {
			let cart = await Cart.findOne({userId: user.id});
			if (!cart) {
				cart = new Cart({
					userId: user._id,
					products: [{productId: product._id, quantity: quantity}],
					totalAmount: product.price * quantity,
				});
			} else {
				const idx = cart.products.findIndex(
					(e) => e.productId.toString() === productId.toString()
				);
				if (idx !== -1) {
					if (product.stock < cart.products[idx].quantity + quantity)
						return res
							.status(400)
							.json({error: `Atmost ${product.stock} available.`});
					cart.products[idx].quantity += quantity;
				} else cart.products.push({productId: product._id, quantity: quantity});
				cart.totalAmount += product.price * quantity;
			}
			await cart.save();
			return res.json(cart);
		} else {
			if (product.stock === 0)
				return res.status(400).json({
					error: `This item ${product.name} is currently out of stock!`,
				});
			return res.status(400).json({
				error: `Insufficient stock. This item ${product.name} has only ${product.stock} left`,
			});
		}
	} catch (e) {
		return res.status(404).json({error: e});
	}
};

export const updateCart = async (req, res) => {
	const {id} = req.params;
	let cart = null;
	try {
		cart = await Cart.findById(id).populate("products.productId");
	} catch (e) {
		return res.status(404).json({error: "Cart not found"});
	}
	if (!cart) {
		return res.status(404).json({error: "Cart not found!!!"});
	}

	const content = req.body;
	if (content?.productId === undefined)
		return res.status(404).json({error: "Please include the product id!!!"});

	const idx = cart.products.findIndex(
		(e) => e.productId._id.toString() === content.productId.toString()
	);

	const prod = await Product.findById(content.productId);

	if (prod.stock === 0) {
		cart.products[idx].message = "Out of Stock";
		await cart.save();
		return res.status(400).json({
			error: `This item ${prod.name} is currently out of stock`,
			cart,
		});
	}
	if (prod.stock < cart.products[idx].quantity) {
		cart.products[idx].message = "Insufficient Stock";
		await cart.save();
		return res.status(400).json({
			error: "Insufficient stock",
			currentStock: `${prod.stock} for ${prod.name}`,
		});
	}
	cart.totalAmount -= cart.products[idx].productId.price * content.quantity;

	cart.products[idx].quantity -= content.quantity;

	if (cart.products[idx].quantity <= 0) {
		cart.products.splice(idx, 1);
		await Cart.findByIdAndDelete(cart.id);
		return res.json({success: "cart successfully removed!!!"});
	}
	await cart.save();
	return res.status(200).json(cart);
};

export const listAllCarts = async (req, res) => {
	try {
		const user = await User.findOne({email: req.user.email});
		const cart = await Cart.findOne({userId: user.id}).populate(
			"products.productId"
		);

		const cartItems = cart.products.map((item) => ({
			id: item.productId._id,
			name: item.productId.name,
			brand: item.productId.brand,
			price: item.productId.price,
			quantity: item.quantity,
			status: item.message,
		}));
		return res.status(200).json({
			id: cart._id,
			userId: cart.userId,
			totalAmount: cart.totalAmount,
			items: cartItems,
		});
	} catch (e) {
		return res.status(404).json({error: e.message});
	}
};

export const deleteCart = async (req, res) => {
	try {
		const cart = await Cart.findByIdAndDelete(req.params.id);
		if (!cart) return res.status(404).json({error: "Cart not found!!!"});
		return res.status(200).json({success: "Cart successfully deleted!!!"});
	} catch (e) {
		return res.status(404).json({error: e});
	}
};
