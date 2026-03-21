# 🎮 LootBay | Level Up Your Setup

**LootBay** is a premium, high-performance e-commerce platform designed for enthusiasts and builders. Whether you're looking for the latest GPUs or building a custom PC from scratch, LootBay provides a seamless, cyberpunk-inspired experience.

![LootBay Header](file:///C:/Users/User/.gemini/antigravity/brain/1d534be6-1c75-436e-ba2b-431a1c3fec64/media__1774091864631.png)

## 🚀 Key Features

- **🛠️ Advanced PC Builder**: Build your dream machine with real-time socket compatibility checking (Intel LGA1700, AMD AM5/AM4, etc.).
- **🛒 Dynamic Store & Cart**: Effortlessly manage your loot and deploy full PC builds directly to your cart.
- **🔒 Global Authentication**: Secure user accounts with integrated state management and protected routes.
- **🤖 Cyber Assistant**: Integrated AI chatbot to help you navigate the store and find the best components.
- **💎 Premium UI/UX**: A stunning "Glassmorphism" aesthetic with smooth Framer Motion animations and neon accents.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS / Framer Motion
- **State Management**: Zustand / React Context
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js / Express
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **AI**: Google Gemini API

## 📥 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance (or Docker)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Keerthivarman316/ecommerce-app.git
   cd ecommerce-app
   ```

2. **Setup the Backend**:
   ```bash
   cd server
   npm install
   # Create a .env file with DATABASE_URL, JWT_SECRET, and GEMINI_API_KEY
   npx prisma db push
   npx prisma generate
   npm run dev
   ```

3. **Setup the Frontend**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the platform**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
├── client/          # Next.js frontend
│   ├── src/app/     # App router pages
│   ├── src/components/ # UI Components
│   └── src/context/ # Auth & Store context
├── server/          # Express backend
│   ├── src/controllers/ # Business logic
│   ├── src/routes/      # API Endpoints
│   └── prisma/          # Database schema
└── README.md        # This file
```

## 🤝 Contributing

Feel free to fork and improve this project. Any contributions you make are **greatly appreciated**.

---

Built with ❤️ by [Keerthivarman](https://github.com/Keerthivarman316)
