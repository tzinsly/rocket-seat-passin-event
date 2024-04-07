// Import the HTTP module
const http = require('http');

// Define the hostname and port
const port = 3000;

// Create the server
const server = http.createServer((req: any, res: any) => {
  // Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  // Write the response body "Hello World"
  res.end('Hello World from Raw Server\n');
});

// Start the server and listen on the defined port and hostname
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});