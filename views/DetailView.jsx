import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./DetailView.css";

function DetailView() {
    const param = useParams();
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        async function getMovieDetails() {
            try {
                setMovie((await axios.get(`https://api.themoviedb.org/3/movie/${param.id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=videos`)).data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        getMovieDetails();
    }, []);

    const trailer = movie.videos && movie.videos.results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
    const trailerId = trailer ? trailer.key : null;

    return (
        <div className="detail-view">
            <h1>{movie.title}</h1>
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}></img>
            </div>
            <div className="movie-info">
                <p><strong>Genres:</strong> {movie.genres && movie.genres.map((genre) => genre.name).join(', ')}</p>
                <p><strong>Language:</strong> {movie.original_language}</p>
                <p><strong>Release Date:</strong> {movie.release_date}</p>
                <p><strong>Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
                <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                <p><strong>Rating:</strong> {movie.vote_average}</p>
                <p><strong>Overview:</strong> {movie.overview}</p>
            </div>
            <div className="movie-trailer">
                <h2>Trailer</h2>
                <div className="trailer-container">
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${trailerId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
export default DetailView;