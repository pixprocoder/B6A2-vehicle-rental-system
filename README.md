# Vehicle Booking Management System (B6A2-Solution)

A comprehensive vehicle booking management system built with Node.js, TypeScript, and Express. This API provides full CRUD operations for managing vehicles, users, bookings, and authentication with role-based access control.

## Live Site link

[site url](https://vehicle-rental-system-snowy.vercel.app/)

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Multi-role Support**: Admin and Customer roles with different permissions
- **Vehicle Management**: Complete CRUD operations for vehicle inventory
- **User Management**: User registration, retrieval, and management
- **Booking System**: Create, retrieve, and manage vehicle bookings
- **RESTful API**: Clean, well-structured API endpoints
- **PostgreSQL Database**: Robust and scalable database design
- **Password Security**: Bcrypt-based password hashing

## 🛠️ Tech Stack

- **Backend**: Node.js + TypeScript
- **Web Framework**: Express.js v5+
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt.js
- **CORS**: Cross-origin resource sharing support
- **Environment Configuration**: dotenv

## 📁 Project Structure

```
src/
├── app.ts              # Express application setup
├── server.ts           # Server entry point
├── app/
│   ├── helpers/        # Helper functions
│   ├── middleware/     # Authentication and other middleware
│   ├── modules/        # Feature modules (auth, user, vehicle, booking)
│   └── routes/         # API route definitions
├── config/             # Configuration files
├── enum/               # Application enums
└── types/              # TypeScript type definitions
```

## 🚦 API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /api/v1/auth/signup` - Create a new user account
- `POST /api/v1/auth/signin` - User login and JWT generation

### Users (`/api/v1/users`)

- `GET /api/v1/users` - Retrieve all users (Admin only)
- `PUT /api/v1/users/:userId` - Update user information (Admin/Customer)
- `DELETE /api/v1/users/:userId` - Delete a user (Admin only)

### Vehicles (`/api/v1/vehicles`)

- `POST /api/v1/vehicles` - Add a new vehicle (Admin only)
- `GET /api/v1/vehicles` - Retrieve all vehicles
- `GET /api/v1/vehicles/:vehicleId` - Retrieve a specific vehicle
- `PUT /api/v1/vehicles/:vehicleId` - Update a vehicle (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` - Delete a vehicle (Admin only)

### Bookings (`/api/v1/bookings`)

- `POST /api/v1/bookings` - Create a new booking (Admin/Customer)
- `GET /api/v1/bookings` - Retrieve all bookings (Admin/Customer)
- `PUT /api/v1/bookings/:bookingId` - Update a booking (Admin/Customer)

### Root Endpoint

- `GET /` - Health check endpoint

## 🔐 Role-Based Access Control

The system supports two roles:

- **Admin**: Full access to all endpoints
- **Customer**: Limited access based on permissions

### Access Permissions by Role:

#### Auth Module

- All users: `POST /api/v1/auth/signup`, `POST /api/v1/auth/signin`

#### User Module

- Admin: `GET /api/v1/users`, `DELETE /api/v1/users/:userId`
- Admin/Customer: `PUT /api/v1/users/:userId`

#### Vehicle Module

- All: `GET /api/v1/vehicles`, `GET /api/v1/vehicles/:vehicleId`
- Admin: `POST /api/v1/vehicles`, `PUT /api/v1/vehicles/:vehicleId`, `DELETE /api/v1/vehicles/:vehicleId`

#### Booking Module

- Admin/Customer: All endpoints

## 📋 Installation

1. **Clone the repository**

```bash
git clone <https://github.com/pixprocoder/B6A2-vehicle-rental-system.git>
cd b6a2-solution
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**
   Copy the `.env.example` file to create a `.env` file and fill in the required values:

```bash
cp .env.example .env
```

4. **Environment Variables**

```env
PORT=6001
DATABASE_URL="your_postgres_connection_string"
JWT_SECRET="your_jwt_secret_key"
```

5. **Build the project**

```bash
bun run build
```

## ▶️ Running the Application

**Development Mode:**

```bash
bun run dev
```

**Production Mode:**
After building:

```bash
node dist/server.js
```

The server will start on the port specified in your `.env` file (default: 6001).

## 🧪 Database Setup

The application uses PostgreSQL as the database with neondb. Ensure you have PostgreSQL installed and running, then update your `DATABASE_URL` environment variable with your database connection string.

## 🚨 Error Handling

The application provides comprehensive error handling with structured error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errorMessages": [
    {
      "path": "request_path",
      "message": "Detailed error message"
    }
  ]
}
```

## ✅ Response Format

Successful responses follow this structure:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## 🛡️ Security Features

- JWT-based authentication with expiration
- Role-based access control
- Password hashing with bcrypt
- Input sanitization
- CORS protection
