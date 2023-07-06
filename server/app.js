import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { WebSocketServer } from 'ws';
import { ChatEngine } from './chat-engine.js';

const hostname = '127.0.0.1';
const port = 3010;

const engine = new ChatEngine();

// ws
let wsMap = new Map();

// users
let userMap = new Map();

// REST API
const app = express()
app.use('/', function(req, res, next) {
  console.log(`received ${req.method} ${req.url}`);
  next();
})
app.use('/', express.static('client/static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.json())    // <==== parse request body as JSON
app.post('/login', function(req, res) {
  let login = req.body.uname;
  let pass = req.body.pass;
  console.log(`login attempt from ${login} with pass ${pass}`);
  let savedPass = userMap.get(login);
  if (savedPass == null) {
    userMap.set(login, pass);
    savedPass = pass;
  }
  if (savedPass != pass) {
    res.sendStatus(403);
    return;
  }
  res.cookie('session', login);
  res.redirect('back');
})
app.post('/logout', function(req, res) {
  res.clearCookie('session');
  res.redirect('back');
})
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
