// YOUR JAVASCRIPT CODE FOR INDEX.HTML GOES HERE

// Backend API URL - When using catalyst serve, functions are served at /server/{function-name}/
// For local development: http://localhost:3000/server/all_new_requests/
// For production: https://your-domain.com/server/all_new_requests/
const API_BASE_URL = 'http://localhost:3000/server/all_new_requests';

function displayResponse(data, status = 'success') {
    const responseBox = document.getElementById('response');
    const timestamp = new Date().toLocaleTimeString();
    
    let formattedData = data;
    if (typeof data === 'string') {
        try {
            formattedData = JSON.stringify(JSON.parse(data), null, 2);
        } catch (e) {
            formattedData = data;
        }
    } else {
        formattedData = JSON.stringify(data, null, 2);
    }
    
    responseBox.textContent = `[${timestamp}] ${status.toUpperCase()}\n\n${formattedData}`;
    responseBox.style.color = status === 'error' ? '#ff6b6b' : '#00ff00';
    
    // Auto-scroll to response section on desktop, smooth scroll on mobile
    scrollToResponse();
}

function scrollToResponse() {
    const responseSection = document.querySelector('.response-section');
    if (responseSection) {
        // On mobile/tablet, scroll the response into view
        if (window.innerWidth <= 1024) {
            responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // On desktop, focus the response box
            const responseBox = document.getElementById('response');
            responseBox.scrollTop = 0;
            responseBox.focus();
        }
    }
}

async function testGET() {
    const endpoint = document.getElementById('getEndpoint').value;
    const params = document.getElementById('getParams').value;
    const url = params ? `${API_BASE_URL}${endpoint}?${params}` : `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        displayResponse({
            status: response.status,
            statusText: response.statusText,
            url: url,
            data: data
        });
    } catch (error) {
        displayResponse({
            error: error.message,
            url: url,
            backendUrl: API_BASE_URL,
            note: 'Make sure the backend server is running on ' + API_BASE_URL
        }, 'error');
    }
}

async function testPOST() {
    const endpoint = document.getElementById('postEndpoint').value;
    const bodyText = document.getElementById('postBody').value;
    
    try {
        const body = bodyText ? JSON.parse(bodyText) : {};
        const url = `${API_BASE_URL}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        displayResponse({
            status: response.status,
            statusText: response.statusText,
            url: url,
            data: data
        });
    } catch (error) {
        displayResponse({
            error: error.message,
            details: 'Invalid JSON in body or request failed',
            backendUrl: API_BASE_URL,
            note: 'Make sure the backend server is running on ' + API_BASE_URL
        }, 'error');
    }
}

async function testPUT() {
    const endpoint = document.getElementById('putEndpoint').value;
    const bodyText = document.getElementById('putBody').value;
    
    try {
        const body = bodyText ? JSON.parse(bodyText) : {};
        const url = `${API_BASE_URL}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        displayResponse({
            status: response.status,
            statusText: response.statusText,
            url: url,
            data: data
        });
    } catch (error) {
        displayResponse({
            error: error.message,
            details: 'Invalid JSON in body or request failed',
            backendUrl: API_BASE_URL,
            note: 'Make sure the backend server is running on ' + API_BASE_URL
        }, 'error');
    }
}
