# 💬 CONVOC -- Frontend

Modern real-time chat application frontend built with **React + Vite**.\
Part of the full-stack **CONVOC MERN Chat Platform**.

This is a Live Chat application which i have built with react and other libraries, and i have made it from scratch.
including Figma design of this project.

------------------------------------------------------------------------

## 🚀 Tech Stack

-   ⚛️ React (Vite)
-   🎨 Tailwind CSS
-   🗂️ Zustand (State Management)
-   🌐 Axios (API Integration)
-   🔐 JWT Authentication
-   🔄 Socket.io (Planned)

------------------------------------------------------------------------

## 📁 Project Structure

src/ 
│ 
├── components/ \# Reusable UI components 
├── pages/ \# Application pages (Login, Register, Chat, etc.) 
├── store/ \# Zustand stores (Auth Store) 
├── lib/ \# Axios instance & helpers 
├── assets/ \# Static assets 
└── App.jsx

------------------------------------------------------------------------

## 🔐 Authentication System

-   Zustand Auth Store
-   JWT token handling
-   Persistent login state
-   Backend API integration

------------------------------------------------------------------------

## 🌍 Environment Variables

Create a `.env` file in the root directory:

VITE_API_BASE_URL=http://localhost:3000/api

Axios instance is configured using:

import.meta.env.VITE_API_BASE_URL

------------------------------------------------------------------------

## 🎨 UI & Design

-   UI designed in Figma
-   Styled with Tailwind CSS
-   Components built using shadcn/ui
-   Fully responsive layout

------------------------------------------------------------------------

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/riteshcgiri/convoc-frontend.git\
cd convoc-frontend

### 2️⃣ Install dependencies

npm install

### 3️⃣ Run development server

npm run dev

App will run on:

http://localhost:5173

------------------------------------------------------------------------

## 🔮 Upcoming Features

-   🔄 Real-time messaging with Socket.io
-   🎙️ Voice calling
-   📹 Video calling
-   🖥️ Screen sharing
-   🟢 Online/Offline status
-   📨 Message notifications
-   🌙 Dark mode toggle

------------------------------------------------------------------------

## 📌 Project Status

🚧 Currently in active development.

-   Authentication flow completed\
-   UI structure completed\
-   Real-time chat integration in progress

------------------------------------------------------------------------

## 👨‍💻 Author

Ritesh Giri\
Frontend Developer
