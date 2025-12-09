'use strict';

const url = require('url');
const querystring = require('querystring');

// In-memory data storage
const storage = {
	users: [],
	data: []
};

// Auto-increment ID generator
let userIdCounter = 1;

module.exports = (req, res) => {
	// Parse URL and extract pathname and query parameters
	const parsedUrl = url.parse(req.url, true);
	const pathname = parsedUrl.pathname;
	const queryParams = parsedUrl.query;
	const method = req.method;

	// Set default CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	// Handle OPTIONS request for CORS preflight
	if (method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}

	// Route handling based on method and pathname
	switch (method) {
		case 'GET':
			handleGET(pathname, queryParams, res);
			break;
		case 'POST':
			handlePOST(pathname, req, res);
			break;
		case 'PUT':
			handlePUT(pathname, req, res);
			break;
		default:
			res.writeHead(405, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ error: 'Method Not Allowed', method: method }));
			res.end();
	}
};

// GET Handler - receives parameters from query string
function handleGET(pathname, queryParams, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' });

	switch (pathname) {
		case '/':
			res.write(JSON.stringify({
				message: 'Welcome to Catalyst Advanced IO API',
				availableEndpoints: {
					get: {
						'/': 'Welcome message',
						'/users': 'Get all users or filter by query params',
						'/data': 'Get all stored data'
					},
					post: {
						'/users': 'Create a new user (requires JSON body with name, email)',
						'/data': 'Create new data entry'
					},
					put: {
						'/users': 'Update a user (requires id in body)',
						'/data': 'Update data entry'
					}
				},
				storageStatus: {
					totalUsers: storage.users.length,
					totalDataEntries: storage.data.length
				}
			}));
			break;

		case '/data':
			res.write(JSON.stringify({
				message: 'GET /data endpoint',
				queryParameters: queryParams,
				storedData: storage.data,
				totalEntries: storage.data.length
			}));
			break;

		case '/users':
			// Support filtering by query parameters
			let filteredUsers = storage.users;
			
			if (queryParams.id) {
				filteredUsers = storage.users.filter(u => u.id == queryParams.id);
			} else if (queryParams.name) {
				filteredUsers = storage.users.filter(u => 
					u.name.toLowerCase().includes(queryParams.name.toLowerCase())
				);
			} else if (queryParams.email) {
				filteredUsers = storage.users.filter(u => 
					u.email.toLowerCase().includes(queryParams.email.toLowerCase())
				);
			}

			res.write(JSON.stringify({
				message: 'GET /users endpoint',
				queryParams: queryParams,
				users: filteredUsers,
				totalUsers: filteredUsers.length,
				allUsersCount: storage.users.length
			}));
			break;

		default:
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ error: 'GET endpoint not found', path: pathname }));
	}
	res.end();
}

// POST Handler - receives parameters from request body (JSON)
function handlePOST(pathname, req, res) {
	let body = '';

	// Collect data chunks from request body
	req.on('data', chunk => {
		body += chunk.toString();
	});

	req.on('end', () => {
		res.setHeader('Content-Type', 'application/json');

		try {
			const parsedBody = body ? JSON.parse(body) : {};

			switch (pathname) {
				case '/users':
					// Validate required fields
					if (!parsedBody.name || !parsedBody.email) {
						res.writeHead(400);
						res.write(JSON.stringify({
							error: 'Missing required fields',
							required: ['name', 'email'],
							received: Object.keys(parsedBody)
						}));
						res.end();
						return;
					}

					// Create new user with auto-incremented ID
					const newUser = {
						id: userIdCounter++,
						name: parsedBody.name,
						email: parsedBody.email,
						...parsedBody,
						createdAt: new Date().toISOString()
					};

					// Store user in memory
					storage.users.push(newUser);

					res.writeHead(201); // Created
					res.write(JSON.stringify({
						message: 'User created successfully',
						statusCode: 201,
						user: newUser,
						totalUsers: storage.users.length
					}));
					break;

				case '/data':
					const newDataEntry = {
						id: storage.data.length + 1,
						...parsedBody,
						createdAt: new Date().toISOString()
					};

					storage.data.push(newDataEntry);

					res.writeHead(201);
					res.write(JSON.stringify({
						message: 'Data entry created successfully',
						statusCode: 201,
						data: newDataEntry,
						totalEntries: storage.data.length
					}));
					break;

				default:
					res.writeHead(404);
					res.write(JSON.stringify({ error: 'POST endpoint not found', path: pathname }));
			}
			res.end();
		} catch (e) {
			res.writeHead(400);
			res.write(JSON.stringify({
				error: 'Invalid JSON in request body',
				message: e.message
			}));
			res.end();
		}
	});
}

// PUT Handler - receives parameters from request body (JSON)
function handlePUT(pathname, req, res) {
	let body = '';

	// Collect data chunks from request body
	req.on('data', chunk => {
		body += chunk.toString();
	});

	req.on('end', () => {
		res.setHeader('Content-Type', 'application/json');

		try {
			const parsedBody = body ? JSON.parse(body) : {};

			switch (pathname) {
				case '/users':
					// Find user by ID
					if (!parsedBody.id) {
						res.writeHead(400);
						res.write(JSON.stringify({
							error: 'User ID is required for update',
							received: parsedBody
						}));
						res.end();
						return;
					}

					const userIndex = storage.users.findIndex(u => u.id == parsedBody.id);

					if (userIndex === -1) {
						res.writeHead(404);
						res.write(JSON.stringify({
							error: 'User not found',
							id: parsedBody.id,
							availableUsers: storage.users.map(u => ({ id: u.id, name: u.name }))
						}));
						res.end();
						return;
					}

					// Update user
					const updatedUser = {
						...storage.users[userIndex],
						...parsedBody,
						updatedAt: new Date().toISOString()
					};

					storage.users[userIndex] = updatedUser;

					res.writeHead(200);
					res.write(JSON.stringify({
						message: 'User updated successfully',
						statusCode: 200,
						user: updatedUser,
						totalUsers: storage.users.length
					}));
					break;

				case '/data':
					if (!parsedBody.id) {
						res.writeHead(400);
						res.write(JSON.stringify({
							error: 'Data ID is required for update',
							received: parsedBody
						}));
						res.end();
						return;
					}

					const dataIndex = storage.data.findIndex(d => d.id == parsedBody.id);

					if (dataIndex === -1) {
						res.writeHead(404);
						res.write(JSON.stringify({
							error: 'Data entry not found',
							id: parsedBody.id
						}));
						res.end();
						return;
					}

					const updatedData = {
						...storage.data[dataIndex],
						...parsedBody,
						updatedAt: new Date().toISOString()
					};

					storage.data[dataIndex] = updatedData;

					res.writeHead(200);
					res.write(JSON.stringify({
						message: 'Data updated successfully',
						statusCode: 200,
						data: updatedData,
						totalEntries: storage.data.length
					}));
					break;

				default:
					res.writeHead(404);
					res.write(JSON.stringify({ error: 'PUT endpoint not found', path: pathname }));
			}
			res.end();
		} catch (e) {
			res.writeHead(400);
			res.write(JSON.stringify({
				error: 'Invalid JSON in request body',
				message: e.message
			}));
			res.end();
		}
	});
}
