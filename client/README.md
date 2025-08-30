# Coin Tracker - Next.js Frontend

A modern Next.js application for tracking cryptocurrency transactions with authentication and protected routes.

## Features

- **Authentication System**: Login and registration with form validation
- **Protected Routes**: Middleware-based route protection
- **Responsive Design**: Modern UI with Tailwind CSS
- **NestJS Integration**: Connected to NestJS backend API
- **Cookie-based Auth**: Secure authentication using HTTP-only cookies
- **Conditional Layout**: Clean auth pages vs. full dashboard layout

## Project Structure

```
src/
├── app/
│   ├── (page)/
│   │   └── (auth)/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── register/
│   │           └── page.tsx
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── api/
│   │   └── api.tsx
│   ├── validation/
│   │   ├── login.ts
│   │   └── register.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── page.tsx
│   └── layout.tsx
├── middleware.ts
└── globals.css
```

## Layout System

The application uses a **single layout** with conditional rendering:

- **Auth Pages** (`/login`, `/register`): Clean, centered design without sidebar/header
- **Protected Pages** (`/dashboard`, `/profile`): Full layout with sidebar and header
- **Home Page** (`/`): Auto-redirects based on authentication status

## Authentication Flow

1. **Registration**: Users can register with email, password, and personal details
2. **Login**: Users can log in with email and password
3. **Auto-redirect**: After successful registration, users are automatically logged in and redirected to dashboard
4. **Protected Routes**: Dashboard and profile pages require authentication
5. **Middleware**: Server-side route protection using Next.js middleware

## API Endpoints

The frontend connects to a NestJS backend with the following endpoints:

- `POST /api/v1/users` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure your NestJS backend is running on `http://localhost:4000`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Route Protection

- **Public Routes**: `/`, `/login`, `/register`
- **Protected Routes**: `/dashboard`, `/profile`
- **Auto-redirect**: Authenticated users visiting auth routes are redirected to dashboard
- **Middleware**: Unauthenticated users visiting protected routes are redirected to login

## Styling

The application uses:
- **Tailwind CSS** for utility classes
- **Custom CSS classes** for auth components
- **Responsive design** for mobile and desktop
- **Modern UI** with gradients and shadows

## Form Validation

- **Zod schemas** for client-side validation
- **React Hook Form** for form management
- **Real-time validation** with error messages
- **Password requirements**: Minimum 8 characters with uppercase, lowercase, and digit

## State Management

- **React Context** for authentication state
- **LocalStorage** for user persistence
- **Cookie-based tokens** for secure authentication
