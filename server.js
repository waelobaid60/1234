const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        io.emit('chat message', data); // هذه هي المسؤولة عن إرسالها للطرف الآخر
    });
});

const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// المنفذ الذي اتفقت عليه مع Railway
const PORT = 8080; 

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        // نرسل البيانات (الاسم، الرسالة، الوقت) للجميع
        io.emit('chat message', data); 
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
