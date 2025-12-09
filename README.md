# Advanced IO Requests - Catalyst Application

A complete, production-ready Catalyst application demonstrating advanced input/output request handling with full-featured HTTP GET, POST, and PUT methods. Includes an interactive web-based testing interface, comprehensive error handling, and seamless frontend-backend integration with automatic environment detection.

## ✨ Features

- **HTTP Methods**: Full GET, POST, PUT implementation with proper status codes
- **Data Persistence**: In-memory storage with auto-incrementing IDs and timestamps
- **Query Filtering**: Filter users by ID, name, or email on GET requests
- **Comprehensive Error Handling**: Input validation, JSON parsing errors, resource lookups
- **Interactive UI**: Beautiful browser-based testing interface with real-time responses
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **CORS Support**: Cross-origin requests enabled for frontend-backend communication
- **Dynamic Routing**: Automatically detects environment (local/production) for correct API paths
- **Auto-scroll UI**: Response section automatically comes into view on request completion
- **Modern Typography**: Inter font family with Fira Code monospace fallback

## 📁 Project Structure

```
advanced-io-requests/
├── catalyst.json                 # Main Catalyst configuration
├── package.json                  # Root npm configuration with scripts
├── README.md                     # This file
├── test.md                       # Comprehensive testing guide
├── .gitignore                    # Git exclusions
├── .catalystignore               # Catalyst-specific exclusions
│
├── functions/
│   └── all_new_requests/         # Backend function (Node 14)
│       ├── index.js              # HTTP handler (300+ lines)
│       ├── catalyst-config.json  # Function-specific configuration
│       ├── package.json          # Function dependencies
│       └── ...
│
└── client/
    ├── client-package.json       # Client metadata
    ├── index.html                # Frontend HTML structure
    ├── main.js                   # Frontend JavaScript logic (140+ lines)
    ├── main.css                  # Frontend styles (200+ lines)
    └── ...
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 14 or higher
- **Catalyst CLI** ([Install](https://www.catalystapp.com/docs/))
- **npm** or **yarn** package manager

### Installation

```bash
# Clone and navigate to project
git clone <repository-url>
cd advanced-io-requests

# Install dependencies
npm install
cd functions/all_new_requests && npm install && cd ../..

# Verify Catalyst is installed
catalyst --version
```

## 💻 Local Development

### Start the Application

```bash
# Start with npm script (recommended)
npm start

# Or using Catalyst CLI directly
catalyst serve

# Or use development alias
npm run dev
```

**Access the application:**
- Frontend: `http://localhost:3000`
- API: `http://localhost:3000/server/all_new_requests/`

### npm Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Start local development server |
| `npm run serve` | Alias for npm start |
| `npm run dev` | Alias for npm start |
| `npm run build` | Build the application |
| `npm run deploy` | Deploy to Catalyst |

## 🌐 API Reference

All endpoints are available at `/server/all_new_requests/` in both local and production environments.

### GET Requests

#### Get All Users
```http
GET /server/all_new_requests/users
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-12-09T10:30:00Z",
      "updatedAt": "2025-12-09T10:30:00Z"
    }
  ]
}
```

#### Get User by ID
```http
GET /server/all_new_requests/users?id=1
```

#### Filter Users by Name
```http
GET /server/all_new_requests/users?name=John
```

#### Filter Users by Email
```http
GET /server/all_new_requests/users?email=john@example.com
```

### POST Requests

#### Create New User
```http
POST /server/all_new_requests/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-12-09T10:30:00Z",
    "updatedAt": "2025-12-09T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Name and email are required"
}
```

### PUT Requests

#### Update User
```http
PUT /server/all_new_requests/users/1
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2025-12-09T10:30:00Z",
    "updatedAt": "2025-12-09T10:45:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "status": "error",
  "message": "User not found"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET or PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Missing required fields, invalid JSON |
| 404 | Not Found | User ID doesn't exist |
| 405 | Method Not Allowed | Unsupported HTTP method |

## 🎨 Frontend Interface

The interactive testing interface has three main sections:

### GET Section
- **Endpoint Field**: Pre-filled with `/users`
- **Query Parameters**: Optional filters (id, name, email)
- **Test Button**: Execute request and view results

### POST Section
- **Name Field**: User's full name (required)
- **Email Field**: User's email address (required)
- **Test Button**: Create new user entry

### PUT Section
- **User ID Field**: ID of user to update (required)
- **Name Field**: Updated name (optional)
- **Email Field**: Updated email (optional)
- **Test Button**: Update existing user

### Response Panel
- Displays raw API response in JSON format
- Color-coded status indicators:
  - **Green** (200-299): Success
  - **Blue** (400-499): Client error
  - **Red** (500+): Server error
- Shows response timestamp
- Auto-scrolls into view on request completion

## 🚢 Production Deployment

### Deploy to Catalyst

```bash
# Using npm script
npm run deploy

# Or using Catalyst CLI directly
catalyst deploy
```

### Production Routing

When deployed, your application will be available at:

| Component | URL |
|-----------|-----|
| **Frontend** | `https://your-domain.com/` |
| **API Endpoint** | `https://your-domain.com/server/all_new_requests/` |

### How Automatic Routing Works

The frontend uses dynamic URL construction to automatically discover the backend:

```javascript
// In client/main.js
const API_BASE_URL = window.location.origin + '/server/all_new_requests';

// On localhost:3000 → http://localhost:3000/server/all_new_requests
// On production → https://your-domain.com/server/all_new_requests
```

This means:
- ✅ No hardcoded URLs needed
- ✅ Works in any environment (local, staging, production)
- ✅ Automatic scaling and multi-region support

## 🧪 Testing

For comprehensive testing documentation, see [test.md](./test.md).

### Quick cURL Examples

**Create a user:**
```bash
curl -X POST http://localhost:3000/server/all_new_requests/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Get all users:**
```bash
curl http://localhost:3000/server/all_new_requests/users
```

**Get user by ID:**
```bash
curl "http://localhost:3000/server/all_new_requests/users?id=1"
```

**Update a user:**
```bash
curl -X PUT http://localhost:3000/server/all_new_requests/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

### Testing with Browser UI

1. Run `npm start`
2. Open `http://localhost:3000` in your browser
3. Use the interactive form sections to test endpoints
4. View responses in real-time on the right panel

## 🛠️ Technical Details

### Backend (Node.js 14)

**Stack**: Catalyst Advanced IO (advancedio) function type

**Key Characteristics**:
- Native Node.js HTTP handler (no framework)
- Streaming request body handling for efficient I/O
- In-memory storage with auto-incrementing user IDs
- Comprehensive request validation
- Proper CORS headers for cross-origin requests
- Clean error handling with appropriate HTTP status codes

**Data Structure**:
```javascript
storage = {
  users: [
    {
      id: 1,
      name: "User Name",
      email: "user@example.com",
      createdAt: "ISO 8601 timestamp",
      updatedAt: "ISO 8601 timestamp"
    }
  ],
  nextUserId: 2
}
```

### Frontend (HTML5, CSS3, JavaScript)

**Stack**: Vanilla JavaScript, no frameworks

**Architecture**:
- Responsive flexbox layout (side-by-side on desktop, stacked on mobile)
- Real-time API response display with status color coding
- Auto-scroll to response section on request completion
- Dynamic API URL construction for cross-environment compatibility
- Inter font family for modern typography

**Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

## ⚙️ Configuration

### Catalyst Configuration

**catalyst.json** - Main configuration file:
```json
{
  "version": 3,
  "functions": {
    "functions/all_new_requests/": {
      "function_name": "all_new_requests"
    }
  },
  "client": {
    "source_root": "client"
  }
}
```

**functions/all_new_requests/catalyst-config.json** - Function-specific config:
```json
{
  "deployment": {
    "name": "all_new_requests",
    "stack": "node14",
    "type": "advancedio",
    "main": "index.js"
  }
}
```

### Environment Variables

To use environment variables:

1. Add to `functions/all_new_requests/catalyst-config.json`:
```json
{
  "deployment": {
    "env_variables": {
      "LOG_LEVEL": "info",
      "MAX_USERS": "100"
    }
  }
}
```

2. Access in code:
```javascript
const logLevel = process.env.LOG_LEVEL;
const maxUsers = parseInt(process.env.MAX_USERS);
```

## 📝 Important Notes

- **Data Persistence**: Data is stored in-memory and resets when the server restarts
- **User IDs**: Auto-incremented starting from 1
- **Timestamps**: `createdAt` and `updatedAt` are automatically managed (ISO 8601 format)
- **Response Format**: All responses are in JSON format
- **Query Parameters**: Case-sensitive for filtering
- **CORS**: Enabled for cross-origin frontend-backend communication

## 🔧 Troubleshooting

### Issue: Application won't start

**Error**: `catalyst serve: command not found`

**Solution**: Install Catalyst CLI globally
```bash
npm install -g zcatalyst-cli
```

### Issue: API returns 404

**Error**: `Cannot POST /server/all_new_requests/users`

**Solution**: 
- Ensure backend is running with `catalyst serve`
- Verify the API URL in browser DevTools
- Check that the full path `/server/all_new_requests/` is used

### Issue: CORS errors in browser console

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: CORS headers should be automatically enabled. Verify they're set in `functions/all_new_requests/index.js`:
```javascript
response.setHeader('Access-Control-Allow-Origin', '*');
```

### Issue: Data disappears after server restart

**Note**: This is expected behavior. Data is stored in-memory and resets when the server restarts.

**For Persistent Storage**: Integrate with a database service:
- PostgreSQL with connection pooling
- MongoDB for NoSQL approach
- Firebase for serverless approach

### Issue: Deployment fails

**Verification Steps**:
1. Ensure all files are in correct directories
2. Verify `catalyst.json` is properly formatted
3. Check Catalyst CLI is authenticated: `catalyst login`
4. Verify `client-package.json` has `"name": "sample-app"`

## 📚 Additional Resources

- [test.md](./test.md) - Comprehensive testing guide with cURL examples
- [Catalyst Documentation](https://www.catalystapp.com/docs/)
- [Catalyst CLI Documentation](https://www.catalystapp.com/docs/cli-reference/)

## 📄 License

MIT

---

**Last Updated**: December 9, 2025  
**Catalyst Stack**: Node 14  
**Function Type**: advancedio  
**Version**: 1.0.0

