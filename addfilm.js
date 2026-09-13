// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Tạo app Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lấy một phần tử HTML thông qua id của phần tử đó.
const getElement = (id) => document.getElementById(id);
const posterInput = getElement("posterInput");
const posterPreview = getElement("posterPreview");
const nameInput = getElement("nameInput");
const genreInput = getElement("genreInput");
const countryInput = getElement("countryInput");
const durationInput = getElement("durationInput");
const ratingInput = getElement("ratingInput");
const nameList = getElement("nameList");
const userEmailEl = getElement("userEmail");

// Hiển thị hoặc ẩn ảnh poster dựa trên đường dẫn người dùng nhập.
const renderPosterPreview = () => {
  if (!posterInput || !posterPreview) return;

  const posterUrl = posterInput.value.trim();
  const previewContainer = posterPreview.parentElement;

  if (!posterUrl) {
    posterPreview.src = "";
    posterPreview.alt = "Poster phim";
    if (previewContainer) previewContainer.style.display = "none";
    return;
  }

  posterPreview.src = posterUrl;
  posterPreview.alt = "Poster phim";
  if (previewContainer) previewContainer.style.display = "block";
};

// Cập nhật ảnh xem trước mỗi khi đường dẫn poster thay đổi.
if (posterInput) {
  posterInput.addEventListener("input", renderPosterPreview);
  renderPosterPreview();
}

// Hiển thị người dùng đang đăng nhập
if (userEmailEl) {
  userEmailEl.textContent = localStorage.getItem("currentUser") || "Khách";
}

// Tải danh sách phim từ Firestore và hiển thị lên danh sách trên trang.
const loadNames = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "names"));
    nameList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      const parts = [data.name || "Không có tên"];
      
      if (data.genre) parts.push(data.genre);
      if (data.country) parts.push(data.country);
      if (data.duration) parts.push(data.duration);
      if (data.rating) parts.push(`⭐ ${data.rating}`);
      li.textContent = parts.join(" | ");
      nameList.appendChild(li);
    });
  } catch ({ message }) {
    alert(`Lỗi khi tải danh sách: ${message}`);
  }
};

// Kiểm tra dữ liệu, lưu thông tin phim vào Firestore và làm mới biểu mẫu.
window.saveName = async () => {
  const name = nameInput.value.trim();
  const genre = genreInput ? genreInput.value.trim() : "";
  const country = countryInput ? countryInput.value.trim() : "";
  const duration = durationInput ? durationInput.value.trim() : "";
  const rating = ratingInput ? ratingInput.value.trim() : "";
  const poster = posterInput ? posterInput.value.trim() : "";

  if (!name) {
    alert("Bạn chưa nhập tên vào!");
    return;
  }

  try {
    await addDoc(collection(db, "names"), { name, genre, country, duration, rating, poster });
    nameInput.value = "";
    if (posterInput) posterInput.value = "";
    if (genreInput) genreInput.value = "";
    if (countryInput) countryInput.value = "";
    if (durationInput) durationInput.value = "";
    if (ratingInput) ratingInput.value = "";
    renderPosterPreview();
    await loadNames();
    alert("Lưu phim thành công!");
  } catch ({ message }) {
    alert(`Lỗi: ${message}`);
  }
};

// Quay lại trang quản trị phim.
window.goBack = () => {
  window.location.href = "admin.html";
};

// Tự động tải danh sách phim khi trang được mở.
loadNames();
