# Rating App - Full Stack Web Application

## Tech Stack
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Frontend**: React.js (Vite)

## Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- npm

## Database Setup

1. Start PostgreSQL and create the database:
```bash
psql -U postgres -c "CREATE DATABASE rating_app;"
```

2. Update `backend/.env` with your PostgreSQL credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rating_app
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

3. Run database migration:
```bash
cd backend
npm run db:init
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```
Server runs on http://localhost:5000

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

## Default Users
Create users through the signup page or admin panel. The first admin must be created directly via the database or signup.

## Database Schema

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(60) | NOT NULL, CHECK(length >= 20) |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| address | VARCHAR(400) | NOT NULL |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'user', CHECK(admin/user/store_owner) |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### stores
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(60) | NOT NULL |
| email | VARCHAR(255) | NOT NULL |
| address | VARCHAR(400) | NOT NULL |
| owner_id | INTEGER | FK -> users.id, ON DELETE CASCADE |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### ratings
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FK -> users.id, ON DELETE CASCADE |
| store_id | INTEGER | FK -> stores.id, ON DELETE CASCADE |
| rating | INTEGER | NOT NULL, CHECK(1-5) |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |
| UNIQUE(user_id, store_id) | | |

## Relations
- User (admin) manages stores, users, and ratings
- User (normal) submits ratings for stores
- User (store_owner) owns one store, views ratings
- Rating links a user to a store with a score of 1-5

## API Endpoints

### Auth
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login
- PUT /api/auth/password - Update password (authenticated)
- GET /api/auth/me - Get current user

### Admin (requires admin role)
- GET /api/admin/dashboard - Stats (users, stores, ratings)
- GET /api/admin/users - List users (filterable, sortable)
- GET /api/admin/users/:id - User detail
- POST /api/admin/users - Create user
- GET /api/admin/stores - List stores
- POST /api/admin/stores - Create store

### Stores (authenticated)
- GET /api/stores - List stores with ratings
- GET /api/stores/:id - Store detail
- POST /api/stores/:id/rate - Submit/update rating

### Dashboard (authenticated)
- GET /api/dashboard/owner - Store owner dashboard

## Validation Rules
- Name: 20-60 characters
- Address: max 400 characters
- Password: 8-16 chars, min 1 uppercase, min 1 special char
- Email: standard email format
- Rating: 1-5 integer
