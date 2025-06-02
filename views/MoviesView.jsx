import { Outlet, useLocation } from "react-router-dom";
import { useStoreContext } from "../context/user.jsx";
import "./MoviesView.css";
import Genres from "../components/Genres.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Feature from "../components/Feature.jsx";


function MoviesView() {
    const location = useLocation();
    const { choices } = useStoreContext();

    return (
        <div className="movies-container">
            <Header />
            <div className="genres-and-movies">
                <div className="genres">
                    <Genres genresList={choices} />
                </div>
                <div className="movie-list">
                    {(location.pathname === "/movies" || location.pathname === "/movies/") && <Feature />}
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default MoviesView;