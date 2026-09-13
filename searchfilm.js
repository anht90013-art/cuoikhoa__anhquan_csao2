function renderMovies() {
    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const genre = document.getElementById("genreFilter").value;

    const filteredMovies = movies.filter(movie => {
        const matchName = movie.title
            .toLowerCase()
            .includes(search);

        const matchGenre = genre === "" || movie.genre === genre;

        return matchName && matchGenre;
    });

    const movieList = document.getElementById("movieList");
    const emptyMessage = document.getElementById("emptyMessage");

    movieList.innerHTML = "";

    if (filteredMovies.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    filteredMovies.forEach(movie => {
        movieList.innerHTML += `
            <tr>
                <td>
                    <img src="${movie.poster}" width="60" alt="${movie.title}">
                </td>
                <td>${movie.title}</td>
                <td>${movie.genre}</td>
                <td>${movie.country || "-"}</td>
                <td>${movie.duration}</td>
                <td>⭐ ${movie.rating}</td>
                <td>
                    <button onclick="editMovie('${movie.id}')">Sửa</button>
                    <button onclick="deleteMovie('${movie.id}')">Xóa</button>
                </td>
            </tr>
        `;
    });
}