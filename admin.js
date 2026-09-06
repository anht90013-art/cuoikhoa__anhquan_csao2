window.goToAddFilmPage = function () {
  window.location.href = "addfilm.html";
};
// Lưu tên và thông tin
window.saveName = async () => {
  const name = nameInput.value.trim();
  const genre = genreInput ? genreInput.value.trim() : "";
  const country = countryInput ? countryInput.value : "";
  
  // Kiểm tra nếu tên trống
  if (!name) {
    alert("Bạn chưa nhập tên vào!");
    return;
  }

  try {
    // Lưu vào Firestore
    await addDoc(colelction(db, "names"), { name, genre, country });
    nameInput.value = "";
    if (genreInput) genreInput.value = "";
    if (countryInput) countryInput.value = "";
    await loadNames();
  } catch ({ message }) {
    alert(`Lỗi: ${message}`);
  }
};

