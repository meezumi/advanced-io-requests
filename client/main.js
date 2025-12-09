// YOUR JAVASCRIPT CODE FOR INDEX.HTML GOES HERE

const API_BASE_URL = window.location.origin;

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
            data: data
        });
    } catch (error) {
        displayResponse({
            error: error.message,
            url: url
        }, 'error');
    }
}

async function testPOST() {
    const endpoint = document.getElementById('postEndpoint').value;
    const bodyText = document.getElementById('postBody').value;
    
    try {
        const body = bodyText ? JSON.parse(bodyText) : {};
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
            data: data
        });
    } catch (error) {
        displayResponse({
            error: error.message,
            details: 'Invalid JSON in body or request failed'
        }, 'error');
    }
}

async function testPUT() {
    const endpoint = document.getElementById('putEndpoint').value;
    const bodyText = document.getElementById('putBody').value;
    
    try {
        const body = bodyText ? JSON.parse(bodyText) : {};
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
            data: data
        });
    } catch (error) {
        displayResponse({
            error: error.message,
            details: 'Invalid JSON in body or request failed'
        }, 'error');
    }
}
