const http = require('http')
const crypto = require('crypto');
const courses = []

const server = http.createServer((req, res) => { 

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    console.log(path)
    const method = req.method;

    if (method === "GET") {
        res.writeHead(200, { "Content-type": "application/json" })
        res.end('{"sms" : "ok!"}')
    
    } else if (method === "POST") {
        let sms = ''

        req.on('data', (chunk) => {
            sms += chunk.toString()
        })

        req.on('end', () => {
            res.writeHead(200, { "Content-type": "application/json" })
            res.end(sms)
        })
    } else if (method === "PUT") { 
        let body = ""

        req.on('data', (chunk) => { 
            body += chunk.toString()

        })

        req.on('end', () => { 
            let parsedBody

            try { 
                parsedBody = JSON.parse(body)

            }catch(err) { 
                res.writeHead(400, { 'Content-type': 'application/json' })
                res.end(JSON.stringify({ error: 'Invalid JSON format' }));
                return;

            }

            const { title, description } = parsedBody;
            const newCourse = {
                id: crypto.randomUUID(),
                title: title.trim(),
                description: description.trim()
            };
            courses.push(newCourse);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newCourse));
        })
        return 
    }
})

server.listen(3001, () => {
    console.log('3001')
})