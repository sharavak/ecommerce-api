import app from "./app.js";

import mongoose from "mongoose";
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/ecommerce";

mongoose.connect(
	DB_URL,
	process.env.NODE_ENV === "development"
		? {autoIndex: true}
		: {autoIndex: false}
);
mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
	console.log("Error connecting to MongoDB", err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
	console.log(`Listening on ${PORT}`);
});
