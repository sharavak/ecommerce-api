import request from "supertest";
import app from "../app";
import User from "../models/User";

let adminToken, userToken, productId, cartId;
describe("E-commerce API Flow", () => {
	it("should register admin, promote, and login", async () => {
		await request(app).post("/api/auth/signup").send({
			name: "Admin User",
			email: "admin@example.com",
			password: "123456",
		});

		const adminUser = await User.findOneAndUpdate(
			{email: "admin@example.com"},
			{role: "admin"},
			{new: true}
		);

		let loginRes = await request(app).post("/api/auth/login").send({
			email: "admin@example.com",
			password: "123456",
		});
		expect(loginRes.statusCode).toBe(200);
		expect(loginRes.body).toHaveProperty("token");
		adminToken = loginRes.body.token;
	});

	it("should let admin create product", async () => {
		const res = await request(app)
			.post("/api/products/new")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				name: "Dell i5",
				brand: "Dell",
				category: "Laptop",
				price: 50000,
				stock: 5,
			});
		expect(res.statusCode).toBe(201);
		productId = res.body._id;
	});

	it("should register and login normal user", async () => {
		await request(app).post("/api/auth/signup").send({
			name: "testuser",
			email: "testuser@example.com",
			password: "123456",
		});

		const loginRes = await request(app).post("/api/auth/login").send({
			email: "testuser@example.com",
			password: "123456",
		});

		expect(loginRes.statusCode).toBe(200);
		expect(loginRes.body).toHaveProperty("token");

		userToken = loginRes.body.token;
	});

	it("should add product to cart", async () => {
		const res = await request(app)
			.post("/api/cart")
			.set("Authorization", `Bearer ${userToken}`)
			.send({
				productId: productId,
				quantity: 2,
			});
		expect(res.statusCode).toBe(200);
		cartId = res.body._id;
	});

	it("should create order", async () => {
		const res = await request(app)
			.post("/api/orders")
			.set("Authorization", `Bearer ${userToken}`)
			.send({cartId: cartId});

		expect(res.statusCode).toBe(201);
	});
});
