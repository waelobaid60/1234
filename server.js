const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080; // المنفذ الناجح حسب الصورة 31393.jpg

// --- إعداد MongoDB ---
// استبدل الرابط أدناه برابط الاتصال الخاص بك من MongoDB Atlas
const mongoURI = "رابط_قاعدة_بياناتك_هنا"; 

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("تم الاتصال بـ MongoDB بنجاح"))
    .catch(err => console.log("خطأ في اتصال MongoDB:", err));

// تعريف شكل الرسالة (Schema)
const msgSchema = new mongoose.Schema({
    user: String,
    txt: String,
    createdAt: { type: Date, default: Date.now, expires: 43200 } // الحذف التلقائي بعد 12 ساعة (43200 ثانية)
});
const Message = mongoose.model('Message', msgSchema);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
    // إرسال آخر الرسائل للمستخدم عند دخوله فوراً
    const oldMessages = await Message.find().sort({ _id: 1 });
    socket.emit('load messages', oldMessages);

    socket.on('chat message', async (data) => {
        const newMsg = new Message({ user: data.user, txt: data.txt });
        await newMsg.save();
        io.emit('chat message', data); 
    });
});

server.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});
