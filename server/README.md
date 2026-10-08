# ApplyTrack Server

Express/Node.js REST API for the ApplyTrack job application tracker.

---

## Features

- **CRUD operations** for job applications
- **Search** across company, position, and location
- **Filter** by status
- **Pagination** with configurable page size
- **Sorting** by date, company, position, or status
- **Dashboard statistics** (total + per-status counts)
- **Server-side validation** with Mongoose schemas
- **Centralized error handling** with structured JSON responses
- **MongoDB ObjectId validation** middleware

---

## Project Structure

```
server/
├── config/
│   └── db.js                       # Mongoose connection logic
├── models/
│   └── Application.js              # Application schema + validation
├── controllers/
│   └── applicationController.js    # Business logic for all routes
├── routes/
│   ├── applicationRoutes.js        # /api/applications
│   └── dashboardRoutes.js          # /api/dashboard
├── middleware/
│   ├── errorHandler.js             # Global error handling + asyncHandler
│   └── validateObjectId.js         # Route-level ObjectId validator
├── .env.example                    # Template for environment variables
├── .gitignore
├── package.json
└── server.js                       # Express app entry point
```

---

## Installation

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**`.env` fields:**

```bash
MONGO_URI=mongodb://localhost:27017/applytrack
PORT=5000
NODE_ENV=development
```

- **Local MongoDB:**  
  `mongodb://localhost:27017/applytrack`
- **MongoDB Atlas:**  
  `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/applytrack`

### 3. Start MongoDB (if running locally)

```bash
mongod
```

Or use MongoDB Atlas (cloud).

### 4. Run the server

**Development** (with auto-restart):

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

## API Endpoints

### Base path: `/api`

| Method | Endpoint                  | Description                          | Query Params                   |
|--------|---------------------------|--------------------------------------|--------------------------------|
| GET    | `/applications`           | List all applications                | `q`, `status`, `page`, `limit`, `sort`, `order` |
| GET    | `/applications/:id`       | Get a single application             | —                              |
| POST   | `/applications`           | Create a new application             | —                              |
| PATCH  | `/applications/:id`       | Update an application (partial)      | —                              |
| DELETE | `/applications/:id`       | Delete an application                | —                              |
| GET    | `/dashboard/stats`        | Dashboard statistics                 | —                              |
| GET    | `/health`                 | Health check                         | —                              |

---

## Endpoint Details

### 1. **GET** `/api/applications`

List all applications with search, filtering, pagination, and sorting.

**Query Parameters:**

| Param    | Type     | Description                                       | Default          |
|----------|----------|---------------------------------------------------|------------------|
| `q`      | `string` | Case-insensitive search across company, position, location | — |
| `status` | `string` | Filter by exact status                            | —                |
| `page`   | `number` | Page number                                       | `1`              |
| `limit`  | `number` | Items per page (max 100)                          | `10`             |
| `sort`   | `string` | Field to sort by (`applicationDate`, `company`, `position`, `status`, `createdAt`, `updatedAt`) | `applicationDate` |
| `order`  | `string` | `asc` or `desc`                                   | `desc`           |

**Example:**

```bash
GET /api/applications?q=google&status=Interview&page=1&limit=10&sort=company&order=asc
```

**Response (200):**

```json
{
  "success": true,
  "data": [ /* array of applications */ ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 2. **GET** `/api/applications/:id`

Get a single application by ID.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "company": "Google",
    "position": "Software Engineer",
    "location": "Mountain View, CA",
    "status": "Interview",
    "applicationDate": "2026-10-01T00:00:00.000Z",
    "jobUrl": "https://careers.google.com/...",
    "notes": "Great opportunity",
    "createdAt": "2026-10-07T12:00:00.000Z",
    "updatedAt": "2026-10-07T12:00:00.000Z"
  }
}
```

**Errors:**
- `400` — Invalid ID format
- `404` — Application not found

---

### 3. **POST** `/api/applications`

Create a new application.

**Request Body (JSON):**

```json
{
  "company": "Google",                     // required
  "position": "Software Engineer",         // required
  "location": "Mountain View, CA",
  "status": "Applied",                     // default: "Applied"
  "applicationDate": "2026-10-01",
  "jobUrl": "https://careers.google.com/...",
  "notes": "Submitted via LinkedIn"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { /* newly created application */ }
}
```

**Errors:**
- `400` — Missing required field or validation error

---

### 4. **PATCH** `/api/applications/:id`

Partially update an application. Only provided fields are changed.

**Request Body (JSON):**

```json
{
  "status": "Interview",
  "notes": "Scheduled for next Tuesday"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": { /* updated application */ }
}
```

**Errors:**
- `400` — Invalid ID, no fields provided, or validation error
- `404` — Application not found

---

### 5. **DELETE** `/api/applications/:id`

Permanently delete an application.

**Response (204 No Content):**

No body.

**Errors:**
- `400` — Invalid ID format
- `404` — Application not found

---

### 6. **GET** `/api/dashboard/stats`

Get dashboard statistics.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "total": 42,
    "byStatus": {
      "Applied": 15,
      "Interview": 10,
      "Technical Round": 5,
      "Offer": 2,
      "Rejected": 10
    },
    "recentApplications": [
      {
        "_id": "...",
        "company": "Google",
        "position": "SWE",
        "status": "Interview",
        "applicationDate": "2026-10-01T00:00:00.000Z"
      }
      // ... 4 more
    ]
  }
}
```

---

## MongoDB Schema

```javascript
{
  company:         String    (required, max 100 chars)
  position:        String    (required, max 100 chars)
  location:        String    (max 100 chars, default "")
  status:          String    (enum: Applied | Interview | Technical Round | Offer | Rejected)
  applicationDate: Date      (default: Date.now)
  jobUrl:          String    (max 500 chars, validated as URL if non-empty)
  notes:           String    (max 2000 chars)
  createdAt:       Date      (auto)
  updatedAt:       Date      (auto)
}
```

**Allowed statuses:**
- `Applied`
- `Interview`
- `Technical Round`
- `Offer`
- `Rejected`

---

## Validation Rules

### Backend (Mongoose + Controller)

1. **Required fields:**  
   - `company` (non-empty)
   - `position` (non-empty)

2. **Field length limits:**  
   - `company`: 100 characters
   - `position`: 100 characters
   - `location`: 100 characters
   - `jobUrl`: 500 characters
   - `notes`: 2000 characters

3. **Status enum:**  
   Only allowed values accepted; default is `"Applied"`

4. **URL validation:**  
   `jobUrl` must be a valid URL if non-empty

5. **ObjectId validation:**  
   Invalid MongoDB IDs return `400` immediately

---

## Error Handling

All errors return a consistent JSON envelope:

```json
{
  "success": false,
  "message": "Error description",
  "errors": { /* optional field-level errors */ }
}
```

**HTTP Status Codes:**

| Code | Meaning                     |
|------|-----------------------------|
| 200  | OK                          |
| 201  | Created                     |
| 204  | No Content (delete success) |
| 400  | Bad Request (validation)    |
| 404  | Not Found                   |
| 409  | Conflict (duplicate key)    |
| 500  | Internal Server Error       |

**Error Types:**

- **Validation error (400):**  
  Returns `errors` object with per-field messages

- **Invalid ObjectId (400):**  
  `"Invalid ID format: \"xyz\""`

- **Not found (404):**  
  `"Application not found with ID: ..."`

- **Duplicate key (409):**  
  `"Duplicate value for field: ..."` (unlikely with current schema)

---

## Testing with curl

### Create an application:

```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "position": "Software Engineer",
    "location": "Mountain View, CA",
    "status": "Applied",
    "jobUrl": "https://careers.google.com/jobs/123",
    "notes": "Applied via referral"
  }'
```

### List applications:

```bash
curl http://localhost:5000/api/applications
```

### Search and filter:

```bash
curl "http://localhost:5000/api/applications?q=google&status=Interview"
```

### Get one application:

```bash
curl http://localhost:5000/api/applications/<id>
```

### Update:

```bash
curl -X PATCH http://localhost:5000/api/applications/<id> \
  -H "Content-Type: application/json" \
  -d '{"status": "Interview"}'
```

### Delete:

```bash
curl -X DELETE http://localhost:5000/api/applications/<id>
```

### Dashboard stats:

```bash
curl http://localhost:5000/api/dashboard/stats
```

---

## Development Notes

### Assumptions

1. **No authentication:**  
   Out of scope per assessment requirements

2. **Single user:**  
   No multi-tenancy or user isolation

3. **No soft deletes:**  
   DELETE permanently removes records

4. **PATCH vs PUT:**  
   Used PATCH for partial updates; PUT would require all fields

5. **Default sort:**  
   Most recent applications first (`applicationDate desc`)

6. **Pagination defaults:**  
   10 items per page; max 100 to prevent performance issues

7. **Search behavior:**  
   Case-insensitive substring match (regex) — good enough for small datasets;  
   for production scale, use MongoDB Atlas Search or Elasticsearch

### Future Enhancements (Out of Scope)

- Authentication (JWT or session-based)
- Role-based access control
- Soft deletes with `deletedAt` field
- File uploads (resume, cover letter)
- Email notifications
- Integration with job board APIs
- Full-text search with Atlas Search
- Rate limiting
- Input sanitization (XSS prevention)
- CORS configuration for specific origins

---

## License

MIT (or specify your license)
