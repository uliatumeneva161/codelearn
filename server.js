const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"status":"starting"}');
  } 
  else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(body);
    });
  } 
  else {
    res.writeHead(405);
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});