# Blog API - Back End

## Description

This project is the back end for a full-stack blog platform built with Node.js, Express, Prisma, and PostgreSQL.  
It provides a RESTful API to manage users, posts, and comments with JWT authentication and role-based access control (admin, editor, and regular users).

This API is consumed by two separate front-end applications:
- [Blog Admin & Editor Frontend](https://github.com/josednl/blog-author-frontend)
- [Blog Public Frontend](https://github.com/josednl/blog-frontend)

---

## Features

- RESTful API architecture with Express.
- **User authentication and authorization** using JWT.
- **Role-based access** (Admin, Editor, User).
- CRUD for posts with **published/unpublished** state.
- Comment system linked to posts.
- **Soft delete** for posts and comments.
- Prisma ORM integration with PostgreSQL.
- Input validation and error handling.

---

## Technologies Used

- **Server**: Node.js, Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (jsonwebtoken)
- **Language**: TypeScript
- **Validation**: express-validator
- **Environment**: dotenv
- **Dev Tools**: Nodemon, ts-node-dev

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://docs.npmjs.com/)

---

### Installation

1. Clone the repository

```bash
git clone https://github.com/josednl/blog-backend.git
cd blog-backend
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in the root directory with the following variables:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/blogdb"
JWT_SECRET="your-secret-key"
PORT=4000
CORS_ORIGIN="http://localhost:5173"
```

4. Generate the Prisma client and migrate the database:

```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:

```bash
npm run dev
```

6. Test the API:

```bash
Open http://localhost:3000 or use Postman
```

## Example Endpoints

| Method | Endpoint | Description |
| :--- | :---: | ---: |
| POST | /auth/login | Login and receive JWT |
| POST | /posts | Create a new post |
| GET | /posts/:id | Get single post |
| DELETE | /comments | Delete comment |
