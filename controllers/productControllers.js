import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
	try {
		const product = new Product(req.body);
		await product.save();
		res.status(201).json(product);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};

export const editProduct = async (req, res) => {
	try {
		const data = req.body;

		const stock = req.body?.stock;
		if (stock !== undefined) {
			data.status = req.body.stock <= 0 ? "Out of Stock" : "In Stock";
			console.log(data);
		}

		const product = await Product.findOneAndUpdate(
			{_id: req.params.id},
			{$set: data},
			{new: true}
		);
		if (!product) {
			return res.status(404).json({error: "Product not found"});
		}

		await product.save();
		await product.updateCart();

		return res.status(200).json(product);
	} catch (error) {
		return res.status(400).json({error: error.message});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const {id} = req.params;
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			return res.status(404).json({error: "Product not found"});
		}
		res.status(200).json({message: "Product deleted successfully"});
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};

export const filterProducts = async (req, res) => {
	try {
		const {category, minPrice, maxPrice} = req.query;
		const filters = {};

		if (category) {
			filters.category = category;
		}

		if (minPrice && maxPrice) {
			filters.price = {$gte: minPrice, $lte: maxPrice};
		}
		const products = await Product.find(filters);
		if (!products || products.length === 0) {
			return res.status(404).json({error: "No products found"});
		}
		return res.status(200).json(products);
	} catch (error) {
		return res.status(400).json({error: error.message});
	}
};

export const allProducts = async (req, res) => {
	const products = await Product.find();
	return res.json(products).status(200);
};
