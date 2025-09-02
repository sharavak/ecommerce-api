import jwt from "jsonwebtoken";

export const isAdmin = async function name(req, res, next) {
	if (req.user && req.user.role === "admin") {
		return next();
	}
	return res.status(403).json({error: "Restricted!"});
};

export const isAuth = async (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split("Bearer ")[1]
	) {
		try {
			const valid = jwt.verify(
				req.headers.authorization.split("Bearer ")[1],
				process.env.SECRET || "secret"
			);
			if (valid) {
				req.user = valid;
				return next();
			} else return res.status(400).json({error: "Token expired!"});
		} catch (e) {
			return res.status(400).json({error: "Token expired!"});
		}
	}
	return res.status(400).json({error: "Token required!"});
};
