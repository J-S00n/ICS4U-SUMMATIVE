import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/user";
import "./GenreView.css";

function GenreView() {
    const navigate = useNavigate();
    const params = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const { cart, setCart } = useStoreContext();
    const moviesPerPage = 20; // Number of movies per page

    useEffect(() => {
        const getGenre = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${params.id}&page=${page}`
                );
                setMovies(response.data.results.slice(0, moviesPerPage));
                setTotalResults(response.data.total_results)
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        getGenre();
    }, [page, params.id]);

    const maxPage = Math.ceil(totalResults / moviesPerPage); // Calculate the total number of pages

    function paginateMovies(newPage) {
        setPage(newPage);
    }

    return (
        <div className="genre-view">
            <div className="movie-list">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div key={movie.id} className="movie-container">
                            <img className="movie-image" height={"300px"} style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/movies/details/${movie.id}`)}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <button
                                className={cart.has(movie.id) ? "buy-button added" : "buy-button"}
                                disabled={cart.has(movie.id)}
                                onClick={() => {
                                    setCart((prev) => prev.set(movie.id, movie));
                                    alert(movie.title + " has been added to your cart!");
                                }}>
                                {cart.has(movie.id) ? "Added" : "Buy"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Loading content</p>
                )}
            </div>
            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => paginateMovies(page - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {page} of {maxPage}
                </span>
                <button
                    disabled={page === maxPage}
                    onClick={() => paginateMovies(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default GenreView;