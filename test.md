# Catalyst Advanced IO API - Testing Guide

This document provides comprehensive testing instructions for the Advanced IO Requests API.

## Prerequisites

1. Ensure the server is running with Catalyst (runs both backend and frontend):
   ```bash
   catalyst serve
   ```
   
   **OR** use npm aliases:
   ```bash
   npm start
   npm run dev
   ```

2. When using `catalyst serve`:
   - The client interface is available at: `http://localhost:3000/`
   - The API endpoints are available at: `http://localhost:3000/server/all_new_requests/`
   - Example: GET users → `http://localhost:3000/server/all_new_requests/users`

3. When using the test server (local development):
   - The API would be at: `http://localhost:8080`
   - Example: GET users → `http://localhost:8080/users`

## Testing Methods

### Method 1: Using cURL (Terminal)

**Note:** When using `catalyst serve`, prepend `/server/all_new_requests` to all URLs.

#### GET Requests

**1. Welcome/Status Check** (using catalyst serve)
```bash
curl -X GET "http://localhost:3000/server/all_new_requests/"
```

Or for local test server:
```bash
curl -X GET "http://localhost:8080/"
```

**2. Get All Users**
```bash
# With catalyst serve
curl -X GET "http://localhost:3000/server/all_new_requests/users"

# Or with local test server
curl -X GET "http://localhost:8080/users"
```

**3. Get User by ID**
```bash
curl -X GET "http://localhost:3000/server/all_new_requests/users?id=1"
```

**4. Filter Users by Name**
```bash
curl -X GET "http://localhost:3000/server/all_new_requests/users?name=John"
```

**5. Filter Users by Email**
```bash
curl -X GET "http://localhost:3000/server/all_new_requests/users?email=john@"
```

**6. Get All Data Entries**
```bash
curl -X GET "http://localhost:3000/server/all_new_requests/data"
```

---

#### POST Requests (Create)

**1. Create a New User**
```bash
curl -X POST "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**2. Create Another User**
```bash
curl -X POST "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com"}'
```

**3. Create with Additional Fields**
```bash
curl -X POST "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Johnson","email":"bob@example.com","phone":"555-1234","role":"admin"}'
```

**4. Create Data Entry**
```bash
curl -X POST "http://localhost:3000/server/all_new_requests/data" \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample Data","description":"Test data entry","value":123}'
```

---

#### PUT Requests (Update)

**1. Update User**
```bash
curl -X PUT "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"John Updated","email":"john.updated@example.com"}'
```

**2. Update User with Additional Fields**
```bash
curl -X PUT "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"John Updated","email":"john.updated@example.com","phone":"555-9999","role":"superadmin"}'
```

**3. Update Data Entry**
```bash
curl -X PUT "http://localhost:3000/server/all_new_requests/data" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"status":"completed","updatedValue":456}'
```

---

## Complete Testing Workflow

Follow these steps to perform a complete end-to-end test:

### Step 1: Check Initial State
```bash
curl -s -X GET "http://localhost:3000/server/all_new_requests/users" | jq .
```
Expected: `"totalUsers": 0`, `"users": []`

### Step 2: Create First User
```bash
curl -s -X POST "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}' | jq .
```
Expected: User created with `id: 1`, `statusCode: 201`

### Step 3: Create Second User
```bash
curl -s -X POST "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com"}' | jq .
```
Expected: User created with `id: 2`, `statusCode: 201`

### Step 4: Retrieve All Users
```bash
curl -s -X GET "http://localhost:3000/server/all_new_requests/users" | jq .
```
Expected: Array with 2 users, `"totalUsers": 2`

### Step 5: Filter by ID
```bash
curl -s -X GET "http://localhost:3000/server/all_new_requests/users?id=1" | jq .
```
Expected: Only user with id=1 returned, `"totalUsers": 1`

### Step 6: Update User
```bash
curl -s -X PUT "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"John Updated","email":"john.updated@example.com"}' | jq .
```
Expected: User updated with `updatedAt` timestamp, `statusCode: 200`

### Step 7: Verify Update
```bash
curl -s -X GET "http://localhost:3000/server/all_new_requests/users?id=1" | jq .
```
Expected: User shows updated name and email, preserves `createdAt`

---

## Error Testing

### Test 1: Missing Required Fields
```bash
curl -s -X POST "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"No Email User"}' | jq .
```
Expected: `"error": "Missing required fields"`, `statusCode: 400`

### Test 2: Invalid JSON
```bash
curl -s -X POST "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{invalid json}' | jq .
```
Expected: `"error": "Invalid JSON in request body"`, `statusCode: 400`

### Test 3: Update Non-existent User
```bash
curl -s -X PUT "http://localhost:3000/server/all_new_requests/users" \
  -H "Content-Type: application/json" \
  -d '{"id":999,"name":"Ghost"}' | jq .
```
Expected: `"error": "User not found"`, `statusCode: 404`

### Test 4: Endpoint Not Found
```bash
curl -s -X GET "http://localhost:3000/server/all_new_requests/nonexistent" | jq .
```
Expected: `"error": "GET endpoint not found"`, `statusCode: 404`

### Test 5: Method Not Allowed
```bash
curl -s -X DELETE "http://localhost:3000/server/all_new_requests/users" | jq .
```
Expected: `"error": "Method Not Allowed"`, `statusCode: 405`

---

## Method 2: Using the Browser Interface

1. Open `http://localhost:3000/` in your browser (when using `catalyst serve`)
2. You'll see an interactive testing interface with three sections:
   - **GET Requests** - Select endpoint and add query parameters
   - **POST Requests** - Select endpoint and write JSON body
   - **PUT Requests** - Select endpoint and write JSON body
3. Fill in the desired fields and click the corresponding button
4. Responses appear in the Response section with formatted JSON and timestamps

**Note:** The frontend automatically uses the correct backend path (`http://localhost:3000/server/all_new_requests/`)

---

## Method 3: Using Postman/Insomnia

### Import the following requests:

**GET Requests Collection:**
- Name: Get All Users | Method: GET | URL: `http://localhost:3000/server/all_new_requests/users`
- Name: Get User by ID | Method: GET | URL: `http://localhost:3000/server/all_new_requests/users?id=1`
- Name: Get All Data | Method: GET | URL: `http://localhost:3000/server/all_new_requests/data`

**POST Requests Collection:**
- Name: Create User | Method: POST | URL: `http://localhost:3000/server/all_new_requests/users`
  - Body: `{"name":"Test User","email":"test@example.com"}`
- Name: Create Data | Method: POST | URL: `http://localhost:3000/server/all_new_requests/data`
  - Body: `{"title":"Test","description":"Test data"}`

**PUT Requests Collection:**
- Name: Update User | Method: PUT | URL: `http://localhost:3000/server/all_new_requests/users`
  - Body: `{"id":1,"name":"Updated","email":"updated@example.com"}`
- Name: Update Data | Method: PUT | URL: `http://localhost:3000/server/all_new_requests/data`
  - Body: `{"id":1,"status":"completed"}`

---

## API Endpoints Reference

### GET Endpoints

| Endpoint | Query Parameters | Description |
|----------|------------------|-------------|
| `/` | None | Welcome message and API status |
| `/users` | `id`, `name`, `email` | Get users (optionally filtered) |
| `/data` | None | Get all data entries |

### POST Endpoints

| Endpoint | Required Fields | Optional Fields | Description |
|----------|-----------------|-----------------|-------------|
| `/users` | `name`, `email` | Any custom fields | Create new user |
| `/data` | None | Any fields | Create data entry |

### PUT Endpoints

| Endpoint | Required Fields | Optional Fields | Description |
|----------|-----------------|-----------------|-------------|
| `/users` | `id` | Any fields to update | Update user by ID |
| `/data` | `id` | Any fields to update | Update data entry by ID |

---

## Response Status Codes

| Code | Meaning | Examples |
|------|---------|----------|
| 200 | OK | Successful GET, successful PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid JSON, missing required fields |
| 404 | Not Found | Endpoint doesn't exist, resource not found |
| 405 | Method Not Allowed | Using unsupported HTTP method |

---

## Notes

- All data is stored in memory only (resets when server restarts)
- User IDs are auto-incremented starting from 1
- `createdAt` timestamp is set when user is created
- `updatedAt` timestamp is set when user is updated
- All responses are in JSON format
- CORS headers are enabled for cross-origin requests
- Query parameters are case-sensitive for filtering

---

## Quick Start Commands

```bash
# Start both backend and frontend with Catalyst (recommended)
catalyst serve

# Or use npm scripts
npm start          # Same as catalyst serve
npm run dev        # Same as catalyst serve
npm run build      # Build for production
npm run deploy     # Deploy to Catalyst
```

---

## Troubleshooting

**Q: "Connection refused" error**
- Make sure the server is running with `catalyst serve`
- Verify the URL is `http://localhost:8080`
- Check if port 8080 is available and not in use

**Q: "Invalid JSON" error**
- Check that all JSON strings are properly quoted
- Use single quotes for curl and double quotes inside JSON

**Q: jq command not found**
- Install jq: `sudo apt-get install jq` (Ubuntu/Debian) or `brew install jq` (macOS)
- Or omit `| jq .` to see raw response

**Q: User not found error on PUT**
- Verify the user ID exists by running GET /users first
- User IDs are auto-incremented (1, 2, 3, etc.)

**Q: Data not persisting after server restart**
- This is expected - data is stored in memory only
- For persistent storage, implement database integration

**Q: catalyst serve not working**
- Make sure you have Catalyst CLI installed globally: `npm install -g zcatalyst-cli`
- Run `catalyst serve` from the project root directory
- Check that catalyst.json is properly configured

