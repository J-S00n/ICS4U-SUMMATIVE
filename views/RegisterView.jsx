import { useNavigate, Link } from "react-router-dom";
import { useStoreContext } from "../context/user";
import { useState, useRef } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, firestore } from "../src/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./RegisterView.css";

function RegisterView() {

    const navigate = useNavigate();
    const { setUser, setChoices, genres } = useStoreContext();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        selectedGenres: [],
    });

    const checkboxesRef = useRef({});

    const registerByEmail = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const selectedGenres = Object.keys(checkboxesRef.current)
            .filter((genreId) => checkboxesRef.current[genreId].checked)
            .map(Number);

        if (selectedGenres.length < 5) {
            alert("Please select at least 5 genres.");
            return;
        }

        const sortedGenres = selectedGenres
            .map((genreId) => genres.find((genre) => genre.id === genreId))
            .filter((genre) => genre) //remove undefined genres
            .sort((a, b) => a.genre.localeCompare(b.genre));

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            alert("Registration successful!");
            setUser(result.user);
            setChoices(sortedGenres);
            const docRef = doc(firestore, "users", result.user.email);
            await setDoc(docRef, { sortedGenres: sortedGenres.map((genre) => genre.id) });
            navigate(`/movies/genre/${sortedGenres[0].id}`);

        } catch (error) {
            console.error("Error registering user:", error);
            alert("Registration failed. If you already have an acccount, please login!");
            return;
        }
    };

    const handleGoogleSignRegister = async () => {
        const selectedGenres = Object.keys(checkboxesRef.current)
            .filter((genreId) => checkboxesRef.current[genreId].checked)
            .map(Number);

        if (selectedGenres.length < 5) {
            alert("Please select at least 5 genres.");
            return;
        }
        const sortedGenres = selectedGenres
            .map((genreId) => genres.find((genre) => genre.id === genreId))
            .filter((genre) => genre) //remove undefined genres
            .sort((a, b) => a.genre.localeCompare(b.genre));

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const docRef = doc(firestore, "users", result.user.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUser(null);
                await signOut(auth);
                alert("User already exists. Please login instead.");
                return;
            } else {
                setUser(result.user);
                setChoices(sortedGenres);
                await setDoc(docRef, {
                    choices: sortedGenres.map((genre) => genre.id),
                });
            }
            navigate(`/movies/genre/${sortedGenres[0].id}`);
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            alert("Google Sign-In failed. Please try again.");
        }
    }

    return (
        <div className="register-container">
            <h1 className="register-title">Register</h1>
            <form onSubmit={registerByEmail} className="register-form">
                <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <input
                    type="password"
                    className="confirmPassword"
                    placeholder="Re-enter Password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                    }}
                    required
                />
                <div className="genre-selection">
                    <h2>Please select at least 5 genres</h2>
                    {genres?.map((item) => (
                        <div key={item.id}>
                            <input
                                type="checkbox"
                                ref={(el) => { checkboxesRef.current[item.id] = el; }}
                                style={{ cursor: "pointer" }}
                            />
                            <label className="genre-name">{item.genre}</label>
                        </div>
                    ))}
                </div>
                <button type="submit">Register</button>
                <p className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
            <button onClick={handleGoogleSignRegister} className="google-signin-button">
                Sign in with Google
            </button>
        </div>
    );
}

export default RegisterView;