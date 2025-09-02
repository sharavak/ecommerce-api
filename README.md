#  E-commerce API (Node.js + Express + MongoDB)

This is a simple **E-commerce REST API** built with **Node.js, Express, and MongoDB**.  
It supports user authentication, cart management, orders, and product CRUD (admin only).  
The API is fully documented with **Swagger UI**.

---

##  Features

- User signup & login with **JWT authentication**
- Product management (create, update, delete) – **admin only**
- Browse products (public)
- Add/remove/update items in cart
- Place orders from cart
- Swagger API docs at `/api-docs`

---

##  Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Swagger UI** for API documentation

---

##  Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/ecommerce-api.git
cd ecommerce-api
npm install

```

---

##  Environment Variables

Create a .env file in the root:

```
PORT=3000
DB_URL=mongodb://localhost:27017/ecommerce
SECRET=your_jwt_secret
```
---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api-docs
```