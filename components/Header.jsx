import { useNavigate, Link } from 'react-router-dom';
import { useStoreContext } from '../context/user';
import { useEffect, useState } from 'react';
import { auth, firestore } from "../src/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import axios from 'axios';

function Header() {
    const navigate = useNavigate();
    const { user, setUser, setPrevPurchases } = useStoreContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    async function fetchSearchResults() {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${searchTerm}`
            );
            const results = response.data.results ? response.data.results.slice(0, 5) : [];
            setSearchResults(results);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (searchTerm) {
                fetchSearchResults();
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchTerm]);

    async function logout() {
        await signOut(auth);
        navigate("/");
    }

    return (
        <div className="header">
            <h1>VibeVision</h1>
            {user ? (
                <>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setTimeout(() => setShowDropdown(false), 100)
                                navigate(`/movies/search/${searchTerm}`);
                            }
                        }}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />
                    {showDropdown && (
                        <div className="dropdown">
                            {searchResults.length > 0 ? (
                                searchResults.map((movie) => (
                                    <div key={movie.id} className="dropdown-item" onClick={() => {
                                        navigate(`/movies/details/${movie.id}`);
                                        setTimeout(() => {
                                            setSearchTerm("");
                                            setShowDropdown(false);
                                        }, 200);
                                    }}>
                                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                                        <p>{movie.title}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No results found</p>
                            )}
                        </div>
                    )}
                    <p className="welcome-msg">Welcome {user.displayName}!</p>
                    <Link to={'/cart'} className="cart-button">Cart</Link>
                    <Link to={'/settings'} className="settings">Settings</Link>
                    <button onClick={logout} className="logout">Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate('/login')} className="login">Login</button>
                    <button onClick={() => navigate('/register')} className="register">Register</button>
                </>
            )}
        </div>
    );
}

export default Header;
