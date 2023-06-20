import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { ChatEngine } from './chat-engine.js';

const hostname = '127.0.0.1';
const port = 3000;

const engine = new ChatEngine();

// ws
let wsMap = new Map();

// REST API
const app = express()
app.use('/', function(req, res, next) {
  console.log(`received ${req.method} ${req.url}`);
  next();
})
app.use('/', express.static('client/static'));

app.use(express.json())    // <==== parse request body as JSON
app.post('/msg', function(req, res) {
  let userId = req.headers['x-user-id'];
  let body = (req.body);
  wsMap.get(userId).send(JSON.stringify({'from': userId, 'data': req.body}));

  engine.publish(userId, JSON.stringify(body));
  res.send('ok');
})

const server = http.createServer(app)


// websocket
const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', function (req, socket, head) {
  socket.on('error', console.error);

  let userId = req.headers['x-user-id'];
  if (userId == null) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  console.log('ws logged in!');
  socket.removeListener('error', console.error);

  wss.handleUpgrade(req, socket, head, function (ws) {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', function (ws, req) {
  const userId = req.headers['x-user-id'];
  wsMap.set(userId, ws);

  ws.on('error', console.error);

  ws.on('message', function (message) {
    console.log(`received message ${message.toString().trim()} from user ${userId}`);
  });
  ws.on('close', function () {
    wsMap.delete(userId);
  });
});

console.log(`server is starting on http://${hostname}:${port}`);
server.listen(port);
