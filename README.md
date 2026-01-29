Expense Tracker

A full-stack web application for managing personal finances. It features a Spring Boot (Java) backend exposing a REST API secured with JWT, and a modern React (TypeScript) frontend. Users can register, log in, and manage income/expense transactions. The dashboard shows current balance and interactive charts for spending vs. income over time. Data is persisted in PostgreSQL.

Features

User Authentication (JWT)
Secure registration and login. Passwords are hashed and protected routes require a valid JWT.

Dashboard Overview
View total income, total expenses, and current balance at a glance.

Transaction Management (CRUD)
Create, view, update, and delete transactions (income/expense).

Interactive Charts (Recharts)
Visualize spending vs income over time and breakdowns (e.g., monthly, by category if enabled).

Responsive UI (Tailwind CSS)
Works well on mobile and desktop.

State Management (Redux Toolkit)
Predictable global state management for auth + transactions.

Instant UI Updates
After a create/update/delete, dashboard and charts reflect changes immediately.

Error Handling & Alerts
User-friendly feedback on success/failure (toasts/messages).

Tech Stack
Frontend

React + TypeScript

Redux Toolkit

Tailwind CSS

Axios

Recharts

Backend

Spring Boot (Java 17+)

Spring Security + JWT

Spring Data JPA (Hibernate)

PostgreSQL

Maven

Folder Structure
├── backend/                   # Spring Boot backend
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── ...
├── frontend/                  # React + TS frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── ...
├── README.md
└── ...

Getting Started
Prerequisites

JDK 17+

Maven

Node.js 18+ (recommended)

PostgreSQL (or Docker)

Environment Variables
Backend (Spring Boot)

Set these in your shell/IDE or application.properties:

DB_URL=jdbc:postgresql://localhost:5432/expensetracker_db
DB_USERNAME=postgres
DB_PASSWORD=mysecretpassword
JWT_SECRET=your_super_long_random_secret

Frontend (React)

If you’re using Vite, use:

VITE_API_URL=http://localhost:8080/api


If you used Create React App instead, rename it to REACT_APP_API_URL.

Run Locally (Manual)
1) Start the Backend
cd backend
mvn spring-boot:run


Backend runs on:

http://localhost:8080

2) Start the Frontend
cd frontend
npm install
npm run dev   # Vite


Frontend runs on:

http://localhost:5173 (Vite default)
(CRA default is http://localhost:3000.)

Run With Docker (Optional)

If you include docker-compose.yml, reviewers can boot everything fast:

docker compose up --build

API Endpoints
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT
Transactions (JWT required)
Method	Endpoint	Description
GET	/api/transactions	List user transactions
GET	/api/transactions/{id}	Get transaction by id
POST	/api/transactions	Create transaction
PUT	/api/transactions/{id}	Update transaction
DELETE	/api/transactions/{id}	Delete transaction

Auth header example:

Authorization: Bearer <token>

Notes / Security

Do not commit your real .env files or secrets.

Store JWT securely. For production, prefer HttpOnly cookies. For MVP, localStorage works but is more exposed to XSS.

Configure CORS allowed origins via environment variables for production deployments.

Contributing

Fork the repo

Create a branch:

git checkout -b feature/your-feature-name


Commit changes

Push and open a PR

License

MIT License (see LICENSE).
