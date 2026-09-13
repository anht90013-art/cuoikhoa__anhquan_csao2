import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let movies = [];

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

window.goToAddFilmPage = () => {
  window.location.href = "addfilm.html";
};

const updateStats = () => {
  const totalEl = document.getElementById("totalMovies");
  const avgEl = document.getElementById("averageRating");
  const latestEl = document.getElementById("latestYear");

  if (totalEl) totalEl.textContent = String(movies.length);

  const ratings = movies
    .map((m) => Number(m.rating))
    .filter((n) => !Number.isNaN(n));
  if (avgEl) {
    avgEl.textContent = ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : "0";
  }

  const years = movies
    .map((m) => Number(m.year))
    .filter((n) => !Number.isNaN(n));
  if (latestEl) {
    latestEl.textContent = years.length ? String(Math.max(...years)) : "-";
  }
};

window.renderMovies = () => {
  const list = document.getElementById("movieList");
  const empty = document.getElementById("emptyMessage");
  if (!list) return;

  const search = (document.getElementById("searchInput")?.value || "")
    .trim()
    .toLowerCase();
  const genre = document.getElementById("genreFilter")?.value || "";

  const filtered = movies.filter((m) => {
    const name = String(m.name || "").toLowerCase();
    const matchSearch = !search || name.includes(search);
    const matchGenre = !genre || m.genre === genre;
    return matchSearch && matchGenre;
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  filtered.forEach((m) => {
    const tr = document.createElement("tr");
    const poster = m.poster
      ? `<img class="movie-poster" src="${escapeHtml(m.poster)}" alt="Poster" />`
      : `<div class="movie-poster"></div>`;

    tr.innerHTML = `
      <td>${poster}</td>
      <td class="movie-name">${escapeHtml(m.name || "Không có tên")}</td>
      <td><span class="genre">${escapeHtml(m.genre || "-")}</span></td>
      <td>${escapeHtml(m.country || m.year || "-")}</td>
      <td>${escapeHtml(m.duration || "-")}</td>
      <td class="rating">${m.rating != null && m.rating !== "" ? escapeHtml(m.rating) : "-"}</td>
      <td>
        <button type="button" class="delete-btn" data-id="${escapeHtml(m.id)}">Xóa</button>
      </td>
    `;

    tr.querySelector(".delete-btn")?.addEventListener("click", () => {
      deleteMovie(m.id);
    });

    list.appendChild(tr);
  });
};

const loadMovies = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "names"));
    movies = [];
    querySnapshot.forEach((item) => {
      movies.push({ id: item.id, ...item.data() });
    });
    updateStats();
    window.renderMovies();
  } catch ({ message }) {
    alert(`Lỗi khi tải danh sách phim: ${message}`);
  }
};

const deleteMovie = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa phim này?")) return;

  try {
    await deleteDoc(doc(db, "names", id));
    await loadMovies();
  } catch ({ message }) {
    alert(`Lỗi khi xóa phim: ${message}`);
  }
};

loadMovies();
