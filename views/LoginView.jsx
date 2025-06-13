import { useNavigate, Link } from "react-router-dom";
import { useStoreContext } from "../context/user";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, firestore } from "../src/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./LoginView.css"

function LoginView() {
    const navigate = useNavigate();
    const { setUser, choices, setChoices, genres } = useStoreContext();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const result = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const docRef = doc(firestore, "users", result.user.email);
            const docSnap = await getDoc(docRef);
            const userData = docSnap.data();
            const firstName = userData.firstName || "User";
            const lastName = userData.lastName || "Account";
            const selectedGenres = userData.choices || [];
            const sortedGenres = selectedGenres
                .map((genreId) => genres.find((genre) => genre.id === genreId))
                .filter((genre) => genre) //remove undefined genres
                .sort((a, b) => a.genre.localeCompare(b.genre));
            setUser({ ...result.user, firstName, lastName });
            setChoices(sortedGenres);
            navigate(`/movies/genre/${sortedGenres[0].id}`);
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed. Please check your credentials.");
            return;
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const docRef = doc(firestore, "users", result.user.email);
            const docSnap = await getDoc(docRef);
            const selectedGenres = docSnap.data()?.choices || [];
            const sortedGenres = selectedGenres
                .map((genreId) => genres.find((genre) => genre.id === genreId))
                .filter((genre) => genre) //remove undefined genres
                .sort((a, b) => a.genre.localeCompare(b.genre));

            setUser(result.user);
            setChoices(sortedGenres);
            navigate(`/movies/genre/${sortedGenres[0].id}`);
        } catch (error) {
            console.error("Error logging in with Google:", error);
            alert("Google login failed. Please try again.");
        }
    }

    return (
        <div className="login-container">
            <div className="login-view">
                <h1 className="login-title">Login</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        value={formData.email}
                        placeholder="Email"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                    <p className="register-link">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
                <button onClick={handleGoogleLogin} className="google-login-button">
                    Login with Google
                </button>
            </div>
        </div>
    );
}
export default LoginView;