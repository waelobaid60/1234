const socket = io();
let myName = "";

// إدارة الدخول بالاسم فقط
function checkAccess() {
    const nameInp = document.getElementById('nameInput');

    if (nameInp.value.trim() !== "") {
        myName = nameInp.value.trim();
        document.getElementById('display-name').innerText = myName;
        document.getElementById('lock-screen').style.display = "none";
        
        // حفظ الاسم في المتصفح لسهولة الدخول لاحقاً
        localStorage.setItem('wael-chat-name', myName);
    } else {
        alert("يرجى كتابة الاسم للدخول");
    }
}

// إضافة ميزة التعرف على الاسم تلقائياً إذا كان مخزناً
window.onload = () => {
    const savedName = localStorage.getItem('wael-chat-name');
    if (savedName) {
        document.getElementById('nameInput').value = savedName;
    }
};

// ... باقي الكود الخاص بـ sendMessage و appendMessage يبقى كما هو بدون تغيير


// 2. إرسال الرسائل النصية
function sendMessage() {
    const input = document.getElementById('messageInput');
    if (input.value.trim()) {
        socket.emit('chat message', { user: myName, message: input.value.trim() });
        input.value = "";
    }
}

// 3. إرسال ملفات (صور/فيديو)
document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        socket.emit('chat message', { 
            user: myName, 
            message: "أرسل ملفاً", 
            file: e.target.result, 
            fileType: file.type 
        });
    };
    reader.readAsDataURL(file);
});

// 4. عرض الرسائل
function appendMessage(data) {
    const chat = document.getElementById('chat-container');
    const div = document.createElement('div');
    div.id = data._id;
    div.className = `msg ${data.user === myName ? 'mine' : 'others'}`;
    
    let html = `<span class="user-tag">${data.user}</span>`;
    html += `<div>${data.message}</div>`;
    
    if (data.file) {
        if (data.fileType.includes('image')) {
            html += `<img src="${data.file}">`;
        } else {
            html += `<video controls src="${data.file}"></video>`;
        }
    }
    
    if (data.user === myName) {
        html += `<span class="delete-btn" onclick="deleteMsg('${data._id}')">حذف للكل</span>`;
    }

    div.innerHTML = html;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// 5. الحذف
function deleteMsg(id) {
    if(confirm("هل أنت متأكد من حذف الرسالة للجميع؟")) {
        socket.emit('delete message', id);
    }
}

// مستمعات Socket
socket.on('load messages', (msgs) => msgs.forEach(appendMessage));
socket.on('chat message', appendMessage);
socket.on('message deleted', (id) => {
    const el = document.getElementById(id);
    if(el) el.remove();
});

// إرسال عبر Enter
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage();
});

document.getElementById('sendBtn').onclick = sendMessage;
