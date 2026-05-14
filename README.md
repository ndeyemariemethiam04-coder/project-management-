# FlowState Project Management App — Setup Guide

A full-stack Kanban and Pomodoro application with React, Node.js, Express, and MySQL.

---

## 1. Database Setup
The project now uses **SQLite**, so no separate database installation is required! The database file (`dev.db`) will be created automatically in the `server/` directory.

---

## 2. Backend Initialization

Open a terminal in the `server/` folder:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run Prisma migrations** (This creates the tables in MySQL):
    ```bash
    npx prisma migrate dev --name init
    ```
3.  **Start the server**:
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:5000`.

---

## 3. Frontend Initialization

Open a new terminal in the `client/` folder:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

---

## 4. Local Deployment with ngrok

To expose your backend to the internet (required if you want to test from other devices or for some webhooks):

1.  **Start ngrok** on the backend port:
    ```bash
    ngrok http 5000
    ```
2.  **Update Frontend URL**: Copy the HTTPS URL provided by ngrok and update the `VITE_API_URL` in `client/.env`.
3.  **Update Backend CORS**: Add the ngrok URL to the `CLIENT_URL` or allowed origins in `server/src/app.js` if necessary (though I've already added a regex for `.ngrok-free.app`).

---

## 5. Deployment to Vercel (Frontend)

1.  **Install Vercel CLI**: `npm i -g vercel`
2.  **Run inside `client/` folder**:
    ```bash
    vercel
    ```
3.  **Environment Variables**: During setup, add `VITE_API_URL` pointing to your deployed backend (e.g., your ngrok URL or a hosted instance like Railway/Render).

---

## Features
- **Authentication**: JWT-based login and registration with token rotation.
- **Kanban Board**: Drag tasks between "To Do", "Ongoing", and "Done".
- **Pomodoro Timer**: Integrated focus timer that logs sessions to your account.
- **Role-based Access**: Owner, Manager, Member, and Viewer roles.
- **Modern UI**: Dark mode, glassmorphism, and smooth animations.
