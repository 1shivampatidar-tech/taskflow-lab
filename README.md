# TaskFlow

A polished full-stack task management application built with the MERN stack.

## Features

- Create and delete tasks
- Filter tasks by status
- Search tasks by title
- Priority labels
- Responsive desktop and mobile interface
- REST API with MongoDB persistence

## Tech Stack

- React + Vite
- Node.js + Express
- MongoDB + Mongoose

## Local Setup

1. Install Node.js and MongoDB.
2. Install dependencies:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```
3. Copy `server/.env.example` to `server/.env` and update `MONGODB_URI` if needed.
4. Start both applications:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173`.

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## License

MIT
