import { useNavigate, Link } from "react-router-dom";
import { useStoreContext } from "../context/user";
import { useState, useRef } from "react";
import { Map } from "immutable";
import "./RegisterView.css";

function RegisterView() {

    const navigate = useNavigate();
    const { setEmail, setFirstName, setLastName, setPassword, setLoggedIn, setChoices, genres } = useStoreContext();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        selectedGenres: [],
    });

    const checkboxesRef = useRef({});

    const handleRegister = (e) => {
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

        alert("Registration successful!");
        setEmail(formData.email);
        setFirstName(formData.firstName);
        setLastName(formData.lastName);
        setPassword(formData.password);
        setChoices(sortedGenres);
        setLoggedIn(true);
        navigate("/movies/genre/28");
    };

    return (
        <div className="register-container">
            <h1 className="register-title">Register</h1>
            <form onSubmit={handleRegister} className="register-form">
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
        </div>
    );
}

export default RegisterView;