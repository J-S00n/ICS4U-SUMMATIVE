import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/user";
import "./SearchView.css";

function SearchView() {
    const navigate = useNavigate();
    const { query } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const { cart, setCart } = useStoreContext();
    const moviesPerPage = 20;

    useEffect(() => {
        if (!query) return;

        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${query}&page=${page}`
                );
                setMovies(response.data.results.slice(0, moviesPerPage));
                setTotalResults(response.data.total_results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchMovies();
    }, [query, page]);

    const maxPage = Math.ceil(totalResults / moviesPerPage);

    return (
        <div className="search-container">
            <h1>Search Results for "{query}"</h1>
            <div className="movie-list">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div key={movie.id} className="movie-container">
                            <img
                                className="movie-image"
                                height="300px"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/movies/details/${movie.id}`)}
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/default-image.jpg"}
                                alt={movie.title}
                            />
                            <button
                                className={cart.has(movie.id) ? "buy-button added" : "buy-button"}
                                disabled={cart.has(movie.id)}
                                onClick={() => {
                                    setCart((prev) => prev.set(movie.id, movie));
                                    alert(`${movie.title} has been added to your cart!`);
                                }}
                            >
                                {cart.has(movie.id) ? "Added" : "Buy"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </div>
            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                </button>
                <span>Page {page} of {maxPage}</span>
                <button disabled={page === maxPage} onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default SearchView;
