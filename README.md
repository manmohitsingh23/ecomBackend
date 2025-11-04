# ecomBackend

A minimal Express + MongoDB backend for an AR-enabled e‑commerce try‑on demo. Built with Node (ESM), Express, Mongoose and designed to work with Cloudinary uploads and AR providers (WANNA / Lens / DeepAR).

> This README was generated from the repository `manmohitsingh23/ecomBackend` and contains setup, environment variables, API documentation, deployment steps (Render), and Postman testing examples.

---

## Table of contents

* [Project structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Local setup](#local-setup)
* [Environment variables](#environment-variables)
* [Start scripts](#start-scripts)
* [Database setup](#database-setup)
* [API Endpoints](#api-endpoints)
* [Postman examples](#postman-examples)
* [Deploying to Render](#deploying-to-render)
* [Cloudinary (manual upload)](#cloudinary-manual-upload)
* [Common troubleshooting](#common-troubleshooting)
* [Next steps / TODOs](#next-steps--todos)

---

## Project structure

```
backend/ (repo root)
├─ models/
├─ routes/
├─ server.js
├─ package.json
└─ .gitignore
```

## Prerequisites

* Node 18+ and npm
* MongoDB Atlas account (or accessible MongoDB)
* (Optional) Cloudinary account for image hosting
* GitHub account for source control

---

## Local setup

1. Clone the repo (or work inside the `backend` folder):

```bash
git clone https://github.com/manmohitsingh23/ecomBackend.git
cd ecomBackend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with required environment variables (see below).

4. Start locally for development (nodemon):

```bash
npm run dev
```

Or run:

```bash
npm start
```

The server listens on `process.env.PORT || 5000`.

---

## Environment variables

Add these to your `.env` (and to Render dashboard when deploying):

```
MONGO_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name    # only if using uploads
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=some_super_secret   # optional for auth
NODE_ENV=development
```

> **Never** commit `.env` to source control.

---

## Start scripts (package.json)

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Make sure `start` runs Node (Render uses `npm start`).

---

## Database setup

1. Create a free cluster on MongoDB Atlas.
2. Create a database user and whitelist IPs (for development you can use `0.0.0.0/0` temporarily).
3. Copy the connection string and set `MONGO_URI` in your `.env` / Render.

---

## API Endpoints

The backend exposes these main routes (mounted paths are shown as they typically appear):

### Auth (`/auth`)

* `POST /auth/signup` — create a normal user
* `POST /auth/login` — login
* `POST /auth/adminSignup` — create admin (sets `isAdmin: true`)

### Items (`/items`)

* `POST /items/bulk` — bulk create items (admin only; needs `userId` in body)
* `GET /items` — list all items
* `GET /items/:id` — get item by id
* `GET /items/category/:cat` — get items by category
* `GET /items/search?q=...` — search items
* `GET /items/p/list?page=1&limit=10` — paginated list
* `PUT /items/:id` — update item (admin only)
* `DELETE /items/:id` — delete item (admin only)

### Cart (`/cart`)

* `POST /cart/add` — add item to cart
* `POST /cart/remove` — remove item from cart
* `GET /cart/:userId` — fetch user's cart
* `PATCH /cart/update` — update item fields (qty, size, color etc)

### Orders (`/orders`)

* `POST /orders/checkout` — checkout (cart → order)
* `GET /orders/:userId` — list user's orders
* (Recommended additions: `GET /orders/details/:orderId`, `PATCH /orders/status/:orderId`, `PATCH /orders/cancel/:orderId`)

### Uploads (`/upload`) (if added)

* `POST /upload` — Cloudinary upload endpoint (multipart) — returns `imageUrl`

---

## Postman examples

Use `Content-Type: application/json` and Body → raw → JSON.

**Signup**

```
POST /auth/signup
{ "name":"Test","email":"t@test.com","password":"123456" }
```

**Admin signup**

```
POST /auth/adminSignup
{ "email":"admin@test.com", "password":"test123" }
```

**Bulk create items**

```
POST /items/bulk
{ "userId":"<adminId>", "items": [ {"name":"Black Tee", "price":799, "size":"MEDIUM", "category":"upperwear", "imagesUrl":["https://res.cloudinary..."], "AR":"WANNA"} ] }
```

**Add to cart**

```
POST /cart/add
{ "userId":"<userId>", "itemId":"<itemId>" }
```

**Checkout**

```
POST /orders/checkout
{ "userId":"<userId>", "address":"..." }
```

---

## Deploying to Render (step-by-step)

1. Push the `backend` folder to a GitHub repo (this repo). Make sure `package.json` and `server.js` are in repo root.
2. Sign up / login to [https://render.com](https://render.com) and connect GitHub.
3. Click **New → Web Service** and choose your repo + branch (main).
4. Set Build command: `npm install` and Start command: `npm start`.
5. Add environment variable `MONGO_URI` (and cloudinary keys if used) in Render service settings.
6. Create service — Render will build & deploy. Test the public URL.

---

## Cloudinary (manual uploads)

To upload images manually: Media Library → Upload → copy **Secure URL** from the image detail panel and put the URLs into `imagesUrl` array when creating items.

---

## Common troubleshooting

* `req.body` undefined → ensure `app.use(express.json())` in `server.js` and Postman uses raw JSON.
* Mongo connection errors → check `MONGO_URI`, Atlas user/password, and IP whitelist.
* Render build fails → check `start` script uses Node and logs for errors.

---

## Next steps / TODOs

* Add JWT auth and protect admin routes
* Add payment gateway integration (Stripe) for checkout
* Implement upload endpoint / direct Cloudinary uploads from frontend
* Improve item model (sizes, SKUs, stock quantity)
* Add admin panel and file validations

---

If you want, I can commit this `README.md` to the repository for you and open a PR, or provide a ready-to-import Postman collection. Tell me what you'd like next.
