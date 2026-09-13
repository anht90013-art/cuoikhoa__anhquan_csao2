// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Tạo app Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lấy DOM elements theo chuẩn ES6
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

if (posterInput) {
  posterInput.addEventListener("input", renderPosterPreview);
  renderPosterPreview();
}

// Hiển thị người dùng đang đăng nhập
if (userEmailEl) {
  userEmailEl.textContent = localStorage.getItem("currentUser") || "Khách";
}

// Load danh sách phim
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

// Lưu tên và thông tin
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

// Quay lại trang admin
window.goBack = () => {
  window.location.href = "admin.html";
};

// Tải danh sách khi vào trang
loadNames();
