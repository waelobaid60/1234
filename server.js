const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// المنفذ الذي يعمل عليه Railway الآن عندك
const PORT = 8080; 

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // استقبال الرسالة من متصفح وإرسالها فوراً للبقية
    socket.on('chat message', (data) => {
        io.emit('chat message', data); 
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
