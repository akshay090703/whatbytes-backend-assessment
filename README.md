# Project Management System API

This is a RESTful API for managing a simplified project management system. It allows users to create and manage projects, assign tasks, and track task statuses. The API is built using **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. It also includes **JWT-based authentication** and role-based authorization.

---

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup Instructions](#setup-instructions)
4. [Project Architecture](#project-architecture)
5. [Prisma Overview](#prisma-overview)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication)
   - [User Management](#user-management)
   - [Project Management](#project-management)
   - [Task Management](#task-management)
   - [Filter Tasks](#filter-tasks)
7. [Middleware](#middleware)
8. [Testing](#testing)

---

## Features
- **User Management**: Create, update, delete, and list users.
- **Project Management**: Create, update, delete, and list projects.
- **Task Management**: Add tasks to projects, assign tasks to users, and update task statuses.
- **Filtering**: Filter tasks by status and assigned user.
- **Authentication**: JWT-based authentication to secure the API.
- **Authorization**: Role-based access control (e.g., admin-only actions).
- **Pagination**: Pagination support for filtering tasks.

---

## Technologies Used
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT)
- **Middleware**: Custom authentication and authorization middleware
- **Tools**: Postman (for testing)

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Git

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/akshay090703/whatbytes-backend-assessment.git
   cd whatbytes-backend-assessment
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up the database**:
   - Create a PostgreSQL database.
   - Update the `.env` file with your database credentials:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/project_management"
     JWT_SECRET="your_jwt_secret"
     ```

4. **Run Prisma schema push**:
   ```bash
   bun db:push
   ```

5. **Run Prisma studio**
   ```bash
   bun db:studio
   ```

6. **Start the server**:
   ```bash
   bun dev
   ```

7. **Test the API**:
   - Use Postman or Thunder Client to test the endpoints.
   - Import the provided Postman collection (if available).

---

## Project Architecture

### Folder Structure
```
project-management-api/
├── src/
│   ├── controllers/        # Route handlers
│   ├── middlewares/        # Authentication and authorization middleware
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions (e.g., JWT)
│   └── index.ts            # Entry point
├── prisma/
│   └── schema.prisma       # Prisma schema
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

### Key Components
1. **Authentication**:
   - JWT-based authentication.
   - Middleware to verify tokens and attach user info to the request object.

2. **Authorization**:
   - Role-based access control (e.g., admin-only actions).

3. **Database**:
   - PostgreSQL with Prisma ORM.
   - Models: `User`, `Project`, `Task`.

4. **Pagination**:
   - Supported in the `/filters/tasks` endpoint using `skip` and `take` query parameters.

---

## **Prisma Overview**

### *Enums*
1. **`Role`**:
   - Defines user roles: `USER` and `ADMIN`.
   - Used in the `User` model to assign roles to users.

2. **`ProjectStatus`**:
   - Defines project statuses: `PLANNED`, `ONGOING`, and `COMPLETED`.
   - Used in the `Project` model to track the status of projects.

3. **`TaskStatus`**:
   - Defines task statuses: `TODO`, `IN_PROGRESS`, and `DONE`.
   - Used in the `Task` model to track the status of tasks.

---

### *Models*

#### **1. `User` Model**
- Represents a user in the system.
- Fields:
  - `id`: Unique identifier (UUID).
  - `name`: User's name.
  - `email`: User's email (unique).
  - `password`: Hashed password for authentication.
  - `role`: User role (`USER` or `ADMIN`).
  - `createdAt`: Timestamp when the user was created.
  - `projects`: One-to-many relationship with the `Project` model.
  - `tasks`: One-to-many relationship with the `Task` model.

#### **2. `Project` Model**
- Represents a project in the system.
- Fields:
  - `id`: Unique identifier (UUID).
  - `name`: Project name.
  - `description`: Project description.
  - `status`: Project status (`PLANNED`, `ONGOING`, or `COMPLETED`).
  - `createdAt`: Timestamp when the project was created.
  - `userId`: Foreign key referencing the `User` who created the project.
  - `user`: Many-to-one relationship with the `User` model.
  - `tasks`: One-to-many relationship with the `Task` model.

#### **3. `Task` Model**
- Represents a task under a project.
- Fields:
  - `id`: Unique identifier (UUID).
  - `title`: Task title.
  - `description`: Task description.
  - `status`: Task status (`TODO`, `IN_PROGRESS`, or `DONE`).
  - `createdAt`: Timestamp when the task was created.
  - `projectId`: Foreign key referencing the `Project` the task belongs to.
  - `project`: Many-to-one relationship with the `Project` model.
  - `assignedUserId`: Foreign key referencing the `User` assigned to the task.
  - `assignedUser`: Many-to-one relationship with the `User` model.

---

## *Relationships*
1. **User ↔ Project**:
   - A user can create multiple projects (`User.projects`).
   - A project belongs to a single user (`Project.user`).

2. **User ↔ Task**:
   - A user can be assigned multiple tasks (`User.tasks`).
   - A task is assigned to a single user (`Task.assignedUser`).

3. **Project ↔ Task**:
   - A project can have multiple tasks (`Project.tasks`).
   - A task belongs to a single project (`Task.project`).

---

## API Endpoints

### Base URL
`http://localhost:3000`

---

### Authentication

| Method | Endpoint       | Description                |
|--------|----------------|----------------------------|
| POST   | `/auth/signup` | Create a new user          |
| POST   | `/auth/signin` | Sign in and get a JWT token|
| GET    | `/auth/signout`| Sign out (invalidate token)|

---

### User Management

| Method | Endpoint       | Description                | Access       |
|--------|----------------|----------------------------|--------------|
| GET    | `/users`       | List all users             | Authenticated|
| PUT    | `/users/:id`   | Update any user            | Admin only   |
| DELETE | `/users/:id`   | Delete any user            | Admin only   |
| GET    | `/users/:id`   | Get single user details    | Authenticated|
| PUT    | `/users/`      | Update current user        | Authenticated|
| DELETE | `/users/`      | Delete current user        | Authenticated|

---

### Project Management

| Method | Endpoint           | Description                | Access       |
|--------|--------------------|----------------------------|--------------|
| POST   | `/projects/`       | Create a new project       | Authenticated|
| GET    | `/projects/`       | List projects of user      | Authenticated|
| GET    | `/projects/:id`    | Get project details        | Authenticated|
| PUT    | `/projects/:id`    | Update a project           | Authenticated|
| DELETE | `/projects/:id`    | Delete a project           | Authenticated|
| GET    | `/projects/all`    | Get all the projects in db | Admin only   |

---

### Task Management

| Method | Endpoint                     | Description                | Access       |
|--------|------------------------------|----------------------------|--------------|
| POST   | `/tasks/:projectId/tasks`    | Create a new task          | Authenticated|
| GET    | `/tasks/:projectId/tasks`    | List tasks for a project   | Authenticated|
| PUT    | `/tasks/:taskId`             | Update a task              | Authenticated|
| DELETE | `/tasks/:taskId`             | Delete a task              | Authenticated|

---

### Filter Tasks

| Method | Endpoint         | Description                              | Access       |
|--------|----------------  |------------------------------------------|--------------|
| GET    | `/filters/tasks` | Filter tasks by status and assigned user | Authenticated|

**Query Parameters**:
- `status`: Filter by task status (e.g., `TODO`, `IN_PROGRESS`, `DONE`).
- `assignedUserId`: Filter by assigned user ID.
- `skip`: Number of tasks to skip (default: `0`).
- `take`: Number of tasks to retrieve (default: `10`).

---

## Middleware

### 1. `authenticateUser`
- Verifies the JWT token.
- Attaches the user's `id` and `role` to the `req.user` object.

### 2. `authorizeRole`
- Restricts access to specific roles (e.g., admin-only actions).

---

## Testing
1. Use Postman or Thunder Client to test the endpoints.
2. Ensure you:
   - Sign up and sign in to get a JWT token.
   - Include the token in the `jwtToken` cookie for protected routes.
   - Test all CRUD operations for users, projects, and tasks.


---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
