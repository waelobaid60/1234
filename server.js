import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

// إعدادات Firebase الخاصة بمشروعك "wael chat"
const firebaseConfig = {
  apiKey: "AIzaSyDpY95ywUC5E3-Xi5TNGvlZQ1XvP_35zlo",
  authDomain: "wael-chat-da664.firebaseapp.com",
  databaseURL: "https://wael-chat-da664-default-rtdb.firebaseio.com", // أضفنا رابط قاعدة البيانات
  projectId: "wael-chat-da664",
  storageBucket: "wael-chat-da664.firebasestorage.app",
  messagingSenderId: "676333359273",
  appId: "1:676333359273:web:e195ac98a1725e4a3359b8",
  measurementId: "G-XEMQYJYFW4"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'messages');

// جلب اسم المستخدم من الذاكرة المحلية (إذا كان مسجلاً سابقاً)
let myName = localStorage.getItem('wael-chat-name') || "";

// دالة الدخول (Lock Screen)
window.checkAccess = () => {
    const nameInp = document.getElementById('nameInput');
    if (nameInp.value.trim() !== "") {
        myName = nameInp.value.trim();
        localStorage.setItem('wael-chat-name', myName); // حفظ الاسم
        document.getElementById('display-name').innerText = myName;
        document.getElementById('lock-screen').style.display = "none";
    }
};

// إرسال الرسائل إلى Firebase
window.sendMessage = () => {
    const input = document.getElementById('messageInput');
    if (input.value.trim() && myName) {
        push(messagesRef, {
            user: myName,
            message: input.value.trim(),
            timestamp: Date.now()
        });
        input.value = "";
    }
};

// استقبال الرسائل وعرضها فوراً
onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    appendMessage({ ...data, _id: snapshot.key });
});

// عرض الرسائل في الواجهة
function appendMessage(data) {
    const chat = document.getElementById('chat-container');
    const div = document.createElement('div');
    div.id = data._id;
    div.className = `msg ${data.user === myName ? 'mine' : 'others'}`;
    div.innerHTML = `
        <span class="user-tag">${data.user}</span>
        <div>${data.message}</div>
        ${data.user === myName ? `<span class="delete-btn" style="cursor:pointer; color:red; font-size:10px;" onclick="deleteMsg('${data._id}')">حذف للكل</span>` : ''}
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// حذف الرسالة للجميع
window.deleteMsg = (id) => {
    if(confirm("هل تريد حذف هذه الرسالة من عند الجميع؟")) {
        remove(ref(db, 'messages/' + id));
        const el = document.getElementById(id);
        if(el) el.remove();
    }
};
