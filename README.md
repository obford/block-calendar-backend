# 🧱 Block Calendar Backend

This is the backend for a block-based calendar app. It lets users create reusable event types (like "Run", "Meeting") and schedule them as time blocks throughout the day — like a vertical time-block puzzle.

---

## 📦 Features

- Create, update, and delete event **templates** (toolbox of blocks)
- Add **active events** to the calendar by time and date
- Prevents overlapping events
- Enforces working hour limits (e.g. 05:00–22:00)
- REST API built with Node.js, Express, MongoDB

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB (via Mongoose)
- UUID for event IDs
- Postman for testing

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/block-calendar-backend.git
cd block-calendar-backend
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Clone the Repository
Create a .env file based on the .env.example:

```bash
cp .env.example .env
```
Then edit it and add your MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/block_calendar
PORT=3000
```

### 4. Run the Server
```bash
npm run dev
```
Server should start at: http://localhost:3000

## 🔌 API Overview

### 🧰 Templates (Event Types)

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/templates        | List all templates  |
| POST   | /api/templates        | Create new template |
| POST   | /api/templates/:id    | Update a template   |
| DELETE | /api/templates/:id    | Delete a template   |

---

### 📅 Active Events (Scheduled Blocks)

| Method | Endpoint                                 | Description                    |
|--------|------------------------------------------|--------------------------------|
| GET    | /api/active-events                       | List all scheduled events      |
| GET    | /api/active-events?date=YYYY-MM-DD       | Filter events by date          |
| POST   | /api/active-events                       | Schedule a new event           |
| POST   | /api/active-events/:id                   | Move or update an active event |
| DELETE | /api/active-events/:id                   | Remove a scheduled event       |

---

## ✅ Status

This is a working first version of the backend. It’s tested using Postman and ready to connect to a frontend app.

---

## 🙋‍♂️ Author

[@obford](https://github.com/obford)

---

## 📌 Future Features (Ideas)

- User accounts / auth  
- Drag & drop frontend UI  
- Block snapping (15-min increments)  
- Free-time suggestions  

---