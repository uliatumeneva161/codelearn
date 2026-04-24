const http = require('http');

const port = 3000
const server = http.createServer((req, res) => { 
    if (req.body === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end('{status":"starting}')

    } else if(req.body === 'POST'){
        let body = ''
        req.on('data', (chunk) => { 
            body += chunk.toString()
        })

        res.on('end', () => { 
            res.writeHead(200, { 'Content-type': 'application/json' })
             res.end(body);
        })
    }
})
server.listen(port, () => { 
    console.log('hello')
})