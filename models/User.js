import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
	email: {
		required: true,
		type: String,
	},
	password: {
		required: true,
		type: String,
	},
	profilePic: {
		type: String,
		default: "N/A",
	},
	address: {
		type: String,
		default: "",
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const {password} = this;
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(password, salt);
	next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
	return await bcrypt.compare(givenPassword, this.password);
};

userSchema.methods.createToken = function () {
	return jwt.sign(
		{email: this.email, id: this._id, role: this.role},
		process.env.SECRET || "secret",
		{
			expiresIn: "7d",
		}
	);
};

export default mongoose.model("User", userSchema);
