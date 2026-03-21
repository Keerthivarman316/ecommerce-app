# 🎮 LootBay

LootBay is a gaming-focused e-commerce platform where users can explore and buy gaming products or even build their own PC.

The idea behind this project was to create something more than a basic ecommerce app — something useful for gamers and PC builders.

---

## 🚀 Features

* 🛠️ Build your own PC with basic compatibility checks
* 🛒 Add products or full PC builds directly to cart
* 🔐 User authentication with protected routes
* 🤖 Chatbot to help users find products
* 🎨 Clean gaming-style UI with animations

---

## 🛠️ Tech Stack

**Frontend**

* Next.js
* Tailwind CSS
* Framer Motion

**Backend**

* Node.js
* Express
* PostgreSQL (Prisma)
* JWT Authentication

---

## 📥 How to Run

1. Clone the repo:

```bash
git clone https://github.com/Keerthivarman316/ecommerce-app.git
cd ecommerce-app
```

2. Backend setup:

```bash
cd server
npm install
```

Create a `.env` file with:

```
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
```

Then run:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

3. Frontend setup:

```bash
cd ../client
npm install
npm run dev
```

4. Open:

```
http://localhost:3000
```

---

## 📁 Structure

```
client/   → frontend  
server/   → backend  
```

---

## 🤝 Contributing

Feel free to fork and improve this project.

---

Built by Keerthivarman
