const http = require('http')

const server = http.createServer((req, res) => { 
    if (req.method === "GET") {
        res.writeHead(200, { "Content-type": "application/json" })
        res.end('{"sms" : "ok!"}')
    
    } else if (req.method === "POST") {
        const sms = ''

        req.on('data', (chunk) => { // 'data' ??
            sms += chunk.toString()    
        })

        req.on('end', () => { 
            res.writeHead('200', { "Content-type": "application/json" })
            res.end(sms)
        })
    }
})

server.listen(3001, () => {
    console.log('3001')
})