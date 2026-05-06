# WanderLust – Full Stack Travel Listing Platform

A production-ready full-stack travel listing platform inspired by modern accommodation and stay-booking applications. WanderLust allows users to explore, create, manage, and review travel listings with secure authentication, cloud-based image uploads, interactive maps, and a fully responsive user experience.

Built using React, Node.js, Express.js, MongoDB, and Cloudinary with a scalable REST API architecture.

---

# Live Demo

* Frontend: Add your deployed frontend URL
* Backend/API: Add your backend URL
* GitHub Repository: Add your GitHub repository link

---

# Features

## User Authentication & Authorization

* Secure user signup and login system
* Session-based authentication using Passport.js
* Protected routes for authenticated users
* Owner-based authorization for listing management
* Secure logout functionality

## Listings Management

* Create new travel/property listings
* Edit existing listings
* Delete listings
* View all listings
* View individual listing details
* Responsive listing cards and detail pages

## Review System

* Add reviews and ratings
* Delete own reviews
* Star rating system
* User-linked review ownership

## Image Uploads

* Cloudinary image storage integration
* Multer-based multipart form handling
* Dynamic image rendering
* Image update support

## Maps & Location

* Interactive Mapbox integration
* Location-based visualization
* Dynamic coordinates rendering

## Frontend Features

* Fully responsive UI
* React Router-based navigation
* Dynamic React state management
* Flash/error messaging system
* Form validation handling
* API-based frontend architecture

## Backend Features

* RESTful API architecture
* Express middleware architecture
* Joi validation
* Error handling middleware
* Secure session handling
* Modular MVC structure

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Vite
* Bootstrap
* CSS3
* Font Awesome

## Backend

* Node.js
* Express.js
* REST API

## Database

* MongoDB
* Mongoose

## Authentication & Security

* Passport.js
* passport-local
* passport-local-mongoose
* express-session
* connect-mongo

## File Upload & Media

* Cloudinary
* Multer
* Multer Storage Cloudinary

## Validation & Utilities

* Joi
* Method Override
* Connect Flash

## Maps & Geolocation

* Mapbox GL JS

## Deployment

* Render

---

# Project Architecture

```bash id="f8x7j2"
major-project/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── validation/
│   ├── config/
│   ├── utils/
│   ├── uploads/
│   └── app.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   └── vite.config.js
│
├── package.json
└── README.md
```

---

# API Endpoints

## Authentication

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/api/auth/signup` | Register new user              |
| POST   | `/api/auth/login`  | Login user                     |
| POST   | `/api/auth/logout` | Logout user                    |
| GET    | `/api/auth/me`     | Get current authenticated user |

---

## Listings

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/listings`     | Fetch all listings   |
| GET    | `/api/listings/:id` | Fetch single listing |
| POST   | `/api/listings`     | Create listing       |
| PUT    | `/api/listings/:id` | Update listing       |
| DELETE | `/api/listings/:id` | Delete listing       |

---

## Reviews

| Method | Endpoint                 | Description   |
| ------ | ------------------------ | ------------- |
| POST   | `/api/reviews`           | Create review |
| DELETE | `/api/reviews/:reviewId` | Delete review |

---

# Authentication Flow

* User authentication is implemented using Passport.js local strategy.
* Sessions are stored securely using MongoDB session storage.
* Protected routes require authentication before performing create, edit, or delete operations.
* Ownership-based authorization ensures only owners can modify their listings or reviews.

---

# Validation & Error Handling

## Validation

* Joi schema validation for listings and reviews
* Frontend form validation
* Secure backend validation middleware

## Error Handling

* Global error handling middleware
* API-specific JSON error responses
* User-friendly frontend error messages
* Validation error rendering

---

# File Upload System

The application uses:

* Multer for multipart form handling
* Cloudinary for cloud image storage
* Dynamic image replacement and updates

Supported functionality:

* Upload listing images
* Replace images during updates
* Optimized cloud-hosted delivery

---

# Map Integration

Map functionality is implemented using Mapbox.

Features:

* Dynamic location visualization
* Coordinate-based rendering
* Interactive listing maps

---

# Frontend Architecture

The frontend follows a scalable component-based architecture using React.

## Core Structure

* Reusable UI components
* Shared layouts
* Context-based state handling
* API abstraction layer
* Protected route handling
* Responsive design system

## Major React Components

* Navbar
* Footer
* Flash Messages
* Listing Cards
* Listing Forms
* Review Components
* Authentication Components
* Map Components

---

# Backend Architecture

The backend follows a modular MVC architecture.

## Controllers

Handle:

* Listing operations
* Review operations
* Authentication logic

## Models

MongoDB models for:

* Users
* Listings
* Reviews

## Middleware

Custom middleware handles:

* Authentication
* Authorization
* Validation
* Async error handling

---

# Security Features

* Session-based authentication
* Password hashing via Passport Local Mongoose
* Protected API routes
* Ownership authorization checks
* Secure environment variable handling

---

# Performance & Scalability

* Modular architecture for scalability
* Reusable frontend components
* RESTful API separation
* Cloud-based media storage
* Optimized React production build
* Express static serving for frontend assets

---

# Installation & Setup

## 1. Clone Repository

```bash id="g2n5ka"
git clone <your-repository-url>
cd major-project
```

---

## 2. Install Dependencies

### Root Dependencies

```bash id="h7v2lm"
npm install
```

### Frontend Dependencies

```bash id="k4p8dt"
cd frontend
npm install
```

---

## 3. Environment Variables

Create a `.env` file in the backend root.

```env id="n9s3qe"
ATLASDB_URL=your_mongodb_connection
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret

MAP_TOKEN=your_mapbox_token
```

---

## 4. Run Development Server

### Backend

```bash id="u6m1zx"
npm start
```

### Frontend

```bash id="v4y9bw"
cd frontend
npm run dev
```

---

# Production Build

```bash id="w2q8fr"
npm run build
npm start
```

---

# Deployment

The application is production-ready and can be deployed on:

* Render
* Railway
* Vercel (Frontend)
* MongoDB Atlas

---

# Future Improvements

* Wishlist functionality
* Advanced search & filters
* Booking system
* Payment integration
* User profile management
* Admin dashboard
* Real-time notifications
* Image optimization pipeline

---

# Learning Outcomes

This project demonstrates:

* Full Stack MERN Development
* REST API Design
* Authentication & Authorization
* Cloud Media Management
* React Architecture
* Backend API Engineering
* MongoDB Data Modeling
* Production Deployment
* Scalable Project Structuring

---

# Author

**Shiva Rama Krishna**
B.Tech Student | MERN Stack Developer | Full Stack Developer

GitHub: Add your GitHub profile
LinkedIn: Add your LinkedIn profile
