const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// هذا السطر يخبر السيرفر: استخدم المنفذ الذي يحدده Railway، وإذا لم يوجد استخدم 3000
const PORT = process.env.PORT || 3000; 

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // إرسال الرسالة للجميع
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
