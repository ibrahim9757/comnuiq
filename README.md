# ComuniQ

A production-ready, real-time chat application designed for seamless and secure communication. ComuniQ supports direct messaging, group channels, media sharing, and Google authentication. Built with the MERN stack and powered by Socket.IO for real-time capabilities.

**[Live Demo](https://chat-comuniq.vercel.app)**

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Authentication & Security

- **JWT-Based Authentication** - Secure session management with JSON Web Tokens
- **Password Encryption** - User credentials protected with bcrypt hashing
- **Google OAuth 2.0** - Seamless single sign-on integration via Passport.js
- **Protected Routes** - Middleware-based route protection for authenticated endpoints

### Messaging

- **Direct Messaging** - Private one-to-one conversations with real-time delivery
- **Group Channels** - Create and manage topic-based or team-specific chat rooms
- **General Chat Room** - Global platform-wide communication channel
- **Real-Time Updates** - Instant message delivery powered by Socket.IO WebSockets
- **Message History** - Persistent conversation storage with MongoDB

### Media & Content

- **File Sharing** - Share images, documents, and media files
- **Cloud Storage** - Media files stored securely on Cloudinary CDN
- **Profile Images** - Custom user avatars with upload/remove functionality

### Performance & Scalability

- **Redis Caching** - User session caching for ultra-fast API responses
- **Online Presence** - Real-time user presence tracking via Redis
- **Multi-Server Ready** - Redis-backed socket mapping enables horizontal scaling
- **Optimized Queries** - Database query optimization with proper indexing

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│                                                                 │
│   React + Vite │ Zustand State │ Socket.IO Client │ Tailwind    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js)                         │
│                                                                 │
│   Express.js │ Socket.IO │ JWT Auth │ Passport.js               │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    CACHING LAYER                        │   │
│   │                                                         │   │
│   │   Redis (Upstash)                                       │   │
│   │   ├── User Session Cache (30 min TTL)                   │   │
│   │   ├── Online Presence (userId → socketId)               │   │
│   │   └── Socket Mapping (socketId → userId)                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌──────────────────────┐   ┌──────────────────────┐
│   MongoDB Atlas      │   │   Cloudinary CDN     │
│                      │   │                      │
│   • Users            │   │   • Profile Images   │
│   • Messages         │   │   • Shared Files     │
│   • Channels         │   │                      │
└──────────────────────┘   └──────────────────────┘
```

---

## Tech Stack

### Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React 18         | UI Framework            |
| Vite             | Build Tool              |
| Zustand          | State Management        |
| Socket.IO Client | Real-time Communication |
| Tailwind CSS     | Styling                 |
| Shadcn/UI        | Component Library       |

### Backend

| Technology  | Purpose             |
| ----------- | ------------------- |
| Node.js     | Runtime Environment |
| Express.js  | Web Framework       |
| Socket.IO   | WebSocket Server    |
| JWT         | Authentication      |
| Passport.js | OAuth Integration   |
| Bcrypt      | Password Hashing    |

### Database & Caching

| Technology      | Purpose            |
| --------------- | ------------------ |
| MongoDB Atlas   | Primary Database   |
| Mongoose        | ODM                |
| Redis (Upstash) | Caching & Presence |

### Cloud Services

| Service        | Purpose          |
| -------------- | ---------------- |
| Cloudinary     | Media Storage    |
| Upstash        | Managed Redis    |
| Vercel         | Frontend Hosting |
| Render/Railway | Backend Hosting  |

---

## Project Structure

```
ComuniQ/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── store/             # Zustand state management
│   │   ├── lib/               # Utilities and helpers
│   │   └── context/           # Socket context provider
│   └── ...
│
├── server/                    # Node.js Backend
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   ├── passport.js        # Google OAuth configuration
│   │   └── redis.js           # Redis connection
│   ├── controllers/
│   │   ├── AuthController.js  # Authentication logic
│   │   ├── MessagesController.js
│   │   ├── ChannelController.js
│   │   └── ContactsController.js
│   ├── middlewares/
│   │   └── AuthMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── UserModel.js
│   │   ├── MessageModel.js
│   │   └── ChannelModel.js
│   ├── routes/
│   │   ├── AuthRoutes.js
│   │   ├── MessagesRoutes.js
│   │   ├── ChannelRoutes.js
│   │   └── ContactRoutes.js
│   ├── utils/
│   │   └── cache.js           # Redis cache helpers
│   ├── socket.js              # Socket.IO configuration
│   └── index.js               # Server entry point
│
└── README.md
```

---

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Upstash Redis account
- Google Cloud Console project (for OAuth)

### Clone Repository

```bash
git clone https://github.com/yourusername/ComuniQ.git
cd ComuniQ
```

### Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Configuration

### Server Environment Variables

Create `server/.env`:

```env
# Server
PORT=3000
ORIGIN=http://localhost:5173

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/comuniq

# Authentication
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth Redirects
CLIENT_LOGIN_REDIRECT_URL=http://localhost:5173/chat
CLIENT_SIGNUP_REDIRECT_URL=http://localhost:5173/profile

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (Upstash)
REDIS_URL=https://your-redis.upstash.io
REDIS_TOKEN=your-redis-token
# Legacy names for compatibility
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token
```

### Client Environment Variables

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
# Legacy fallback (optional)
VITE_SERVER_URL=http://localhost:3000
```

---

## Usage

### Development

```bash
# Start server (from /server directory)
npm run dev

# Start client (from /client directory)
npm run dev
```

### Production Build

```bash
# Build client
cd client
npm run build

# Start server in production
cd ../server
npm start
```

---

## API Reference

### Authentication

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| POST   | `/api/auth/signup`               | Register new user         |
| POST   | `/api/auth/login`                | User login                |
| GET    | `/api/auth/user-info`            | Get current user (cached) |
| POST   | `/api/auth/update-profile`       | Update user profile       |
| POST   | `/api/auth/add-profile-image`    | Upload profile image      |
| DELETE | `/api/auth/remove-profile-image` | Remove profile image      |
| POST   | `/api/auth/logout`               | User logout               |

### Messages

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| POST   | `/api/messages/get-messages` | Get DM history         |
| POST   | `/api/messages/upload-file`  | Upload file attachment |

### Channels

| Method | Endpoint                                       | Description          |
| ------ | ---------------------------------------------- | -------------------- |
| POST   | `/api/channel/create-channel`                  | Create new channel   |
| GET    | `/api/channel/get-user-channels`               | Get user's channels  |
| GET    | `/api/channel/get-channel-messages/:channelId` | Get channel messages |

### Contacts

| Method | Endpoint                            | Description      |
| ------ | ----------------------------------- | ---------------- |
| POST   | `/api/contacts/search`              | Search users     |
| GET    | `/api/contacts/get-contacts-for-dm` | Get DM contacts  |
| GET    | `/api/contacts/get-all-contacts`    | Get all contacts |

---

## Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set root directory to `client`
3. Add environment variables
4. Deploy

### Backend (Render/Railway)

1. Connect GitHub repository
2. Set root directory to `server`
3. Add environment variables
4. Set start command: `npm start`
5. Deploy

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [Upstash](https://upstash.com/) for serverless Redis
- [Cloudinary](https://cloudinary.com/) for media management
- [MongoDB Atlas](https://www.mongodb.com/atlas) for database hosting
