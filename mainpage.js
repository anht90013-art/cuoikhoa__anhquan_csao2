import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  collection,
  getDocs,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const movieList = document.getElementById("firestoreMovies");
const emptyMessage = document.getElementById("firestoreEmpty");

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderMovies = (movies) => {
  if (!movieList) return;

  if (!movies.length) {
    movieList.innerHTML = "";
    if (emptyMessage) emptyMessage.hidden = false;
    return;
  }

  if (emptyMessage) emptyMessage.hidden = true;
  movieList.innerHTML = movies
    .map((movie) => {
      const poster = escapeHtml(movie.poster || "");
      const posterMarkup = poster
        ? `<img src="${poster}" alt="Poster ${escapeHtml(movie.name || "phim")}" loading="lazy">`
        : `<div class="movie-poster-placeholder">No poster</div>`;
      const details = [movie.genre, movie.country, movie.duration]
        .filter(Boolean)
        .map(escapeHtml)
        .join(" | ");

      return `
        <article class="firestore-movie-card">
          ${posterMarkup}
          <div class="firestore-movie-content">
            <h3>${escapeHtml(movie.name || "Không có tên")}</h3>
            <p>${details || "Chưa có thông tin"}</p>
            <strong>⭐ ${escapeHtml(movie.rating || "-")}</strong>
          </div>
        </article>
      `;
    })
    .join("");
};

const loadMovies = async () => {
  try {
    const snapshot = await getDocs(collection(db, "names"));
    const movies = snapshot.docs.map((movie) => movie.data());
    renderMovies(movies);
  } catch (error) {
    console.error("Không thể tải danh sách phim:", error);
    if (emptyMessage) {
      emptyMessage.hidden = false;
      emptyMessage.textContent = "Không thể tải danh sách phim.";
    }
  }
};

loadMovies();
