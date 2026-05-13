const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// المنفذ المتوافق مع Railway
const PORT = 8080; 

// الرابط النهائي المعتمد على بيانات الصورة 31407.jpg
const mongoURI = "mongodb+srv://admin:Wael2026@cluster0.pwloqvx.mongodb.net/?appName=Cluster0";

// إعداد نظام الرسائل مع حذف تلقائي بعد 12 ساعة
const msgSchema = new mongoose.Schema({
    user: String,
    txt: String,
    createdAt: { type: Date, default: Date.now, expires: 43200 } 
});
const Message = mongoose.model('Message', msgSchema);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
    try {
        // تحميل الرسائل القديمة فور دخول المستخدم
        const oldMessages = await Message.find().sort({ _id: 1 });
        socket.emit('load messages', oldMessages);
    } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
    }

    socket.on('chat message', async (data) => {
        const newMsg = new Message({ user: data.user, txt: data.txt });
        await newMsg.save();
        io.emit('chat message', data); 
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
