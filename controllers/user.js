import User from "../models/User.js";

export const createUser = async (req, res) => {
	try {
		const {name, email, password} = req.body;
		const isUser=await User.findOne({email:email});
		if(isUser)
			return res.status(400).json({error:"Account found!!!"})
		const user = new User({name, email, password});

		await user.save();
		res.status(201).json({
			success: "User registered successfully",
		});
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};

export const login = async (req, res) => {
	try {
		const {email, password} = req.body;

		const user = await User.findOne({email});
		if (!user) {
			return res.status(404).json({error: "User not found"});
		}
		const isMatch = await user.comparePassword(password, user.password);

		if (!isMatch) return res.status(401).json({error: "Invalid credentials"});

		const token = user.createToken();
		res.status(200).json({success: "Login successfull", token: token});
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};
