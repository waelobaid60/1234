const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// المنفذ المثبت بناءً على نجاح اتصالك السابق
const PORT = 8080; 

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('مستخدم جديد دخل الدردشة');

    socket.on('chat message', (data) => {
        // إعادة إرسال الرسالة مع الاسم والوقت للجميع فوراً
        io.emit('chat message', data); 
    });

    socket.on('disconnect', () => {
        console.log('مستخدم غادر الدردشة');
    });
});

server.listen(PORT, () => {
    console.log(`السيرفر يعمل بنجاح على المنفذ ${PORT}`);
});
