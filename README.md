#  AidLink

> A full-stack platform designed to connect individuals in need with verified aid and donation campaigns — built with Node.js, MongoDB Atlas, and a modern Vite-powered frontend.

---

##  Features

-  **User Authentication**
-  **Post Campaigns** for Aid/Support
-  **Browse & Search** Aid Listings
-  **Real-time Updates** from Campaigns
-  **Responsive Design** using modern frontend stack
-  **MongoDB Atlas** Integration for secure cloud storage

---

##  Tech Stack

| Layer       | Tech                              |
|-------------|------------------------------------|
| Frontend    | React + Vite + CSS Modules         |
| Backend     | Node.js + Express.js               |
| Database    | MongoDB Atlas                      |
| Dev Tools   | Nodemon, Concurrently, dotenv      |
| Deployment  | Render (Backend) + Bolt.new (UI)   |

---

## ⚙️ Installation & Setup


# 1. Clone the repository
```bash
git clone https://github.com/<your-username>/AidLink.git
cd AidLink
```

# 2. Install dependencies for both client and server
```
npm install
cd client && npm install
cd ..
```

# 3. Add your MongoDB URI in `.env` file
```
touch .env
# Paste this:
# MONGO_URI=your-mongodb-connection-uri
```

# 4. Start development server
```
npm run dev
````

---

##  API Endpoints (Example)

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/campaigns` | Fetch all aid campaigns |
| POST   | `/api/campaigns` | Create a new campaign   |
| GET    | `/api/test`      | Test backend connection |

---


##  Author

**Yash Kansal** B.Tech CSE, Graphic Era Hill University Dehradun

[LinkedIn](https://www.linkedin.com/in/yashkansal)
[Portfolio](https://code-sync-kansal.vercel.app)

---

### 📜 License

MIT License
© 2025 Yash Kansal
