// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { 
  getAuth, 
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { firebaseConfig } from "./config.js";

// Tạo app Firebase
const app = initializeApp(firebaseConfig);
// Lấy auth và db
const auth = getAuth(app);
const db = getFirestore(app);

// Lấy DOM elements theo chuẩn ES6
const getElement = (id) => document.getElementById(id);
const nameInput = getElement("nameInput");
const genreInput = getElement("genreInput");
const countryInput = getElement("countryInput");
const nameList = getElement("nameList");  
const userEmailEl = getElement("tên phim");

// Load danh sách tên
const loadNames = async () => {
  try {
    // Lấy danh sách tên từ Firestore
    const querySnapshot = await getDocs(collection(db, "names"));
    // Xóa danh sách hiện tại trước khi hiển thị danh sách mới
    nameList.innerHTML = "";

    // Hiển thị danh sách tên
    querySnapshot.forEach((doc) => {
      // Lấy dữ liệu từ document
      const data = doc.data();
      // Tạo phần tử li và thêm vào danh sách
      const li = document.createElement("li");
      li.textContent = data.name || "Không có tên";
      nameList.appendChild(li);
    });
  } catch ({ message }) {
    alert(`Lỗi khi tải danh sách: ${message}`);
  }
};

// Lưu tên và thông tin
window.saveName = async () => {
  const name = nameInput.value.trim();
  const genre = genreInput ? genreInput.value.trim() : "";
  const country = countryInput ? countryInput.value.trim() : "";
  
  // Kiểm tra nếu tên trống
  if (!name) {
    alert("Bạn chưa nhập tên vào!");
    return;
  }

  try {
    // Lưu vào Firestore
    await addDoc(collection(db, "names"), { name, genre, country });
    nameInput.value = "";
    if (genreInput) genreInput.value = "";
    if (countryInput) countryInput.value = "";
    await loadNames();
  } catch ({ message }) {
    alert(`Lỗi: ${message}`);
  }
};

// Đăng xuất
window.logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert("Lỗi khi đăng xuất!");
  }
};

