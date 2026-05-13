const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// تم التعديل إلى 8080 بناءً على إعدادات لوحة التحكم التي نجحت معك
const PORT = 8080; 

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('مستخدم جديد اتصل بالدردشة');
    
    socket.on('chat message', (msg) => {
        // إرسال الرسالة لكل المستخدمين المتصلين في نفس الوقت
        io.emit('chat message', msg); 
    });
});

server.listen(PORT, () => {
    console.log(`السيرفر يعمل الآن بنجاح على المنفذ ${PORT}`);
});
