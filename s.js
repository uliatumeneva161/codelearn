const http = require('http');
const crypto = require('crypto');

const port = 3000;
let courses = [];

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
            } catch(err) {
                reject(new Error('Invalid JSON format'));
            }
        });
        
        req.on('error', (err) => {
            reject(err);
        });
    });
}

const server = http.createServer(async (req, res) => { 
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;
    
    console.log(`${method} ${path}`);
    
    if (method === 'GET' && path === '/courses') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(courses));
    } 
    else if (method === 'GET' && path === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'starting' }));
    } 
    else if (method === 'POST') {
        try {
            const body = await parseBody(req); 
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(body));
        } catch(err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    } 
    else if (method === 'PUT' && path === '/courses') {
        try {
            const parsedBody = await parseBody(req);
            
            const { title, desc } = parsedBody;
            
            if (!title || !desc || title === '' || desc === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Title and description are required' }));
                return;
            }
            
            const newCourse = {
                id: crypto.randomUUID(),
                title: title.trim(),
                desc: desc.trim()
            };
            
            courses.push(newCourse);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newCourse));
            
            console.log(`Added course: ${newCourse.id}`);
            console.log(`Total courses: ${courses.length}`);
            
        } catch(err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});