# ApplyTrack

ApplyTrack is a full-stack MERN application for managing and tracking job applications in one place. It allows users to create, view, update, search, filter, and delete job applications, while also providing a dashboard with application statistics and recent applications.

## Features

- Create new job applications
- View application details
- Edit existing applications
- Delete applications with confirmation
- Search applications by company, position, or location
- Filter applications by application status
- Paginate application results
- Dashboard with application statistics
- View recent applications
- Form validation and error handling
- Loading and empty states
- Responsive user interface
- RESTful API architecture

## Technologies Used

### Frontend

- React.js
- Vite
- React Router
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Mongoose
- REST API

### Database

- MongoDB Atlas

### Development Tools

- Git
- GitHub
- Kiro AI

## Project Structure

```text
ApplyTracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express/Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Setup and Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- MongoDB Atlas account or another MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/PranavDDabade/ApplyTracker.git
cd ApplyTracker
```

### 2. Setup the Backend

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory.

Use `.env.example` as a reference and add your MongoDB connection string.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

Do not commit your `.env` file because it contains environment-specific configuration and database credentials.

### 3. Run the Backend

From the `server` directory:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 4. Setup the Frontend

Open a new terminal and navigate to the frontend:

```bash
cd ApplyTracker/client
npm install
```

### 5. Run the Frontend

```bash
npm run dev
```

Vite will display the local development URL, normally:

```text
http://localhost:5173
```

Make sure the backend is running while using the frontend.

## API Endpoints

### Applications

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Create a job application |
| GET | `/api/applications` | Get applications with search, filtering, and pagination |
| GET | `/api/applications/:id` | Get a specific application |
| PATCH | `/api/applications/:id` | Update an application |
| DELETE | `/api/applications/:id` | Delete an application |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get application statistics and recent applications |

## Application Statuses

ApplyTrack supports the following application statuses:

- Applied
- Interview
- Technical Round
- Offer
- Rejected

## AI Development Experience

### AI Tool Used: Kiro

Kiro was used as the AI development tool during the development of ApplyTrack.

I used Kiro to accelerate development across project planning, backend API implementation, database integration, React frontend development, and debugging.

AI-generated code was reviewed and tested during development rather than being accepted without verification. I ran the application locally, tested API endpoints, verified CRUD operations, and checked the integration between the React frontend, Express backend, and MongoDB database.

Using Kiro helped reduce repetitive development work while still requiring me to understand the generated code, make implementation decisions, test the application, and resolve issues during development.

## Specific AI-Assisted Tasks

### 1. Project Architecture and Planning

Kiro was used to plan the overall application architecture, including the separation between the React frontend, Express backend, MongoDB data layer, routes, controllers, middleware, and frontend components.

### 2. Backend API Development

Kiro assisted with implementing the Node.js and Express backend, including:

- MongoDB/Mongoose application model
- CRUD API endpoints
- Search and filtering
- Pagination
- Dashboard statistics
- Request validation
- Error handling

The backend was then run locally and tested to verify the API behavior.

### 3. Database Integration

Kiro assisted with integrating MongoDB using Mongoose and defining the job application data model.

The database integration was verified by creating, retrieving, searching, filtering, and updating application records through the API.

### 4. React Frontend Development

Kiro assisted with implementing the React frontend, including:

- Dashboard
- Application list
- Application creation form
- Application editing
- Application details
- Delete confirmation
- Search and filtering
- Pagination
- Loading and error states

The frontend was connected to the existing Express API and tested end-to-end.

### 5. Testing and Debugging

Kiro was used to assist with identifying and resolving implementation issues during development.

The application was manually tested to verify CRUD operations, API behavior, database integration, and frontend-backend communication.

## Development Approach

The application was developed incrementally, starting with the backend API and MongoDB integration, followed by the React frontend and frontend-backend integration.

AI assistance was used as a development accelerator, while the final implementation was reviewed, tested, and verified during development.
