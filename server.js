const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// زيادة حجم البيانات المسموح بها لإرسال الصور
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

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

const msgSchema = new mongoose.Schema({
    user: String,
    message: String,
    file: String, // لإضافة الصور أو الفيديوهات
    fileType: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', msgSchema);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
        socket.emit('load messages', messages);
    } catch (err) { console.log(err); }

    socket.on('chat message', async (data) => {
        const newMessage = new Message(data);
        try {
            const savedMsg = await newMessage.save();
            io.emit('chat message', { ...data, _id: savedMsg._id });
        } catch (err) { console.log(err); }
    });

    // ميزة حذف الرسالة
    socket.on('delete message', async (id) => {
        try {
            await Message.findByIdAndDelete(id);
            io.emit('message deleted', id);
        } catch (err) { console.log(err); }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
});
