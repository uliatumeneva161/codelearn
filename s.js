const http = require('http');
const crypto = require('crypto');

const port = 3000
 let courses = []
const server = http.createServer((req, res) => { 

    const url = new URL(req.url, `http://${req.headers.host}`)
    const path = url.pathname
    const method = req.method
   
    
    console.log(path)
    if (method === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end('{"status":"starting"}');

    } else if (method === 'POST') {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.end(body);
        })
    } else if (method == 'PUT' && path === '/courses') { 
       
        let body = ""

        req.on('data', (chunk) => { 
            body += chunk.toString()
        })

        req.on('end', () => { 
            let parsedBody

            try { 
                parsedBody = JSON.parse(body)
            } catch(err) {
                res.writeHead('400', { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Invalid JSON format' }));
                return 
            }

             const {title, desc} = parsedBody
        const newCourse = {
            id: crypto.randomUUID(),
            title: title,
            desc: desc
            }
            
        if (parsedBody.title === '' || parsedBody.desc === '') { 
            res.writeHead(400, { 'Content-type': 'application/json'})
            res.end(JSON.stringify({ 'err': 'empty folder!' }))
            return 
        }
        courses.push(newCourse)
            res.writeHead(201, { 'Content-type': 'application/json' })
            
            res.end(JSON.stringify(newCourse))
            
         console.log(`Added course: ${newCourse.id}`);
        console.log(`Total courses: ${courses.length}`);
        })
        
       

    }
})
server.listen(port, () => { 
    console.log('hello')
})