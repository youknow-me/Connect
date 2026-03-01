# NEXUS - Real-Time Chat Application

Full-stack real-time chat application built with React, Node.js, Express, MySQL & Socket.IO.

---

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/) or use MySQL Workbench

---

## Project Structure

```
chat-app/
├── client/          # React Frontend (Vite)
├── server/          # Node.js + Express Backend
├── package.json     # Root scripts
└── README.md
```

---

## Step-by-Step Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/chat-app.git
cd chat-app
```

### Step 2: Install Dependencies

From the project root, run:

```bash
npm run install-all
```

This installs dependencies for root, server, and client.

### Step 3: Create the MySQL Database

Open MySQL Workbench (or MySQL CLI) and run:

```sql
CREATE DATABASE IF NOT EXISTS nexus_chat;
```

### Step 4: Configure Environment Variables

**Server** - Create `server/.env`:

```env
PORT=5001

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nexus_chat
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# File uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Client** - Create `client/.env`:

```env
VITE_API_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

### Step 5: Create Uploads Directory

```bash
mkdir -p server/uploads/avatars
```

### Step 6: Run the Application

**Option A: Run both together (from root)**

```bash
npm run dev
```

**Option B: Run separately (in two terminals)**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### Step 7: Open the App

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001

---

## Using with Dev Tunnels (Remote Access)

If you want to access the app from another device or share it publicly:

1. Forward both ports (5001 and 5173) using VS Code Dev Tunnels or ngrok

2. Update `client/.env` with your backend tunnel URL:
   ```env
   VITE_API_URL=https://your-tunnel-url-5001.devtunnels.ms
   VITE_SOCKET_URL=https://your-tunnel-url-5001.devtunnels.ms
   ```

3. Update `server/.env` with your frontend tunnel URL:
   ```env
   CLIENT_URL=https://your-tunnel-url-5173.devtunnels.ms
   ```

4. Restart both servers

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Socket.IO Client, Axios |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MySQL + Sequelize ORM |
| Auth | JWT + bcrypt |
| Real-time | Socket.IO (WebSockets) |

---

## Features

- JWT Authentication (Register / Login)
- One-to-One Private Messaging
- Group Chat (create, join, manage)
- Real-time messaging via Socket.IO
- Online / Offline status
- Typing indicators
- Message read receipts
- File / Image sharing
- User search
- Responsive dark-themed UI

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /auth/me | Get current user |
| GET | /api/conversations | Get all conversations |
| POST | /api/conversations | Create conversation |
| GET | /api/conversations/:id/messages | Get messages |
| POST | /api/messages | Send message |
| GET | /api/users/search?q= | Search users |

---

## Troubleshooting

**Port 5000/5001 in use (macOS)**
- macOS AirPlay Receiver uses port 5000. Disable it in System Settings > General > AirDrop & Handoff > AirPlay Receiver, or use port 5001.

**Database connection failed**
- Ensure MySQL is running
- Verify credentials in `server/.env`
- Make sure the database `nexus_chat` exists

**CORS errors**
- Ensure `CLIENT_URL` in `server/.env` matches your frontend URL exactly

---

## License

MIT
