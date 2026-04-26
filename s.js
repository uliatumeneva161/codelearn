const http = require('http');
const crypto = require('crypto');

const port = 3000;
let courses = [
  {
    "id": "1",
    "title": "Node.js Basics",
    "desc": "Learn Node.js from scratch"
  },
  {
    "id": "2",
    "title": "Express Framework",
    "desc": "Build web applications with Express"
  },
  {
    "id": "3",
    "title": "MongoDB",
    "desc": "NoSQL database course"
  }
];

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
    let id = path.split('/').pop()

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
    else if (method === 'PUT' && path === `/courses`) {
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
    }else if (method === 'DELETE' && path.startsWith('/courses/')){
        const idCourse = courses.findIndex( course => course.id === id )
        if(idCourse !== -1){
            courses.splice(idCourse, 1)
       res.writeHead(204); 
        res.end();
        console.log(`Deleted course with id: ${id}`);
        console.log(`Remaining courses: ${courses.length}`);
        }else{
              res.writeHead(400); 
        res.end(JSON.stringify({ error: 'Course not found' }));
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