# Gemini Project Configuration

This file helps Gemini understand the project context and conventions.

## Project Overview

This is a full-stack cafeteria management application.

- **Frontend:** A React single-page application for the user interface.
- **Backend:** A Node.js/Express.js server providing a RESTful API.

## How to Run

- **Frontend:**
  - Navigate to the root directory (`C:/Users/Gitau/cafeteria-management`).
  - Run `npm start` to start the React development server.

- **Backend:**
  - Navigate to the backend directory (`C:/Users/Gitau/cafeteria-management/cafeteria-backend`).
  - Run `npm start` or `npm run dev` to start the Node.js server.

## Tech Stack

- **Frontend:**
  - React
  - React Router (`react-router-dom`)
  - `react-scripts` (Create React App)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (`mongoose`) for the database.
  - JWT (`jsonwebtoken`) for authentication.
  - `bcryptjs` for password hashing.
  - `multer` for file uploads.

## Project Structure

- The root directory contains the React frontend application.
- The `cafeteria-backend` directory contains the Node.js backend application.
- The `pg.sql` file suggests a PostgreSQL database might have been used or intended at some point. However, the backend dependencies point to MongoDB. Please clarify if needed.
- Static assets for the frontend are in `src/assets`.
- Reusable React components are in `src/components`.
- Different pages of the application are in `src/pages`.
