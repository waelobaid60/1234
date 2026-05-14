const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// رابط الاتصال بـ MongoDB Atlas الخاص بك
const mongoURI = "mongodb+srv://admin:Wael2026@cluster0.pwloqvx.mongodb.net/chatDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 
}).then(() => {
    console.log("✅ تم الاتصال بـ MongoDB بنجاح!");
}).catch(err => {
    console.error("❌ فشل الاتصال بقاعدة البيانات:", err);
});

// تعريف شكل الرسالة (Schema) لضمان توافق الأسماء
const msgSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', msgSchema);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
    // إرسال الرسائل القديمة للمستخدم الجديد فور اتصاله
    try {
        const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
        socket.emit('load messages', messages);
    } catch (err) {
        console.error("خطأ في جلب الرسائل:", err);
    }

    socket.on('chat message', async (data) => {
        if (data.user && data.message) {
            const newMessage = new Message({
                user: data.user,
                message: data.message
            });
            try {
                await newMessage.save();
                io.emit('chat message', data); // إرسال الرسالة للجميع
            } catch (err) {
                console.error("خطأ في حفظ الرسالة:", err);
            }
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
});
