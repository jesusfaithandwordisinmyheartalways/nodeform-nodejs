



const http = require('http');
const fs = require('fs');
const url = require('url');

// Function to handle HTML and CSS file serving
const backendServer = (res, filePath, contentType) => {
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('404 not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
};

// Function to handle form validation
const userFormSubmission = (req, res) => {
    let bodyText = '';
    req.on('data', (data) => {
        bodyText += data.toString();
    });
    req.on('end', () => {
        const userFormData = new URLSearchParams(bodyText);
        const username = userFormData.get('username');
        const password = userFormData.get('password');
        const confirmPassword = userFormData.get('confirm-password');
        const email = userFormData.get('email');

        const userNameRegex = /^(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])(?=.*\d).{7,}$/;
        const userPasswordRegex = /^(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])(?=.*\d).{7,}$/;
        const userEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!userNameRegex.test(username)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Username must have 1 special character, 1 number & 7 character length');
            return;
        }

        if (!userPasswordRegex.test(password)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Password must have 1 special character, 1 number & 7 character length');
            return;
        }

        if (!userEmailRegex.test(email)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Email Invalid');
            return;
        }

        if (password !== confirmPassword) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Passwords do not match');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('User Form Has Been Accepted');
    });
};

// Create an HTTP server
const httpServer = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET') {
        if (parsedUrl.pathname === '/') {
            backendServer(res, './index.html', 'text/html');
        } else if (parsedUrl.pathname === '/about') {
            backendServer(res, './about.html', 'text/html');
        } else if (parsedUrl.pathname === '/contact') {
            backendServer(res, './contact.html', 'text/html');
        } else if (parsedUrl.pathname === '/public/style/form.css') {
            backendServer(res, './public/style/form.css', 'text/css');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 not found');
        }
    } else if (req.method === 'POST' && parsedUrl.pathname === '/contact') {
        userFormSubmission(req, res); // Corrected to use parsedUrl.pathname
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

// Start the server
const PORT = 3007;
httpServer.listen(PORT, () => {
    console.log(`Node.js form server is running on port: ${PORT}`);
});