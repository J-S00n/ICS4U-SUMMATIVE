import { useNavigate, Link } from "react-router-dom";
import { useStoreContext } from "../context/user";
import { useState } from "react";
import "./LoginView.css"

function LoginView() {

    const navigate = useNavigate();
    const { email, password, setLoggedIn } = useStoreContext();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = (e) => {
        e.preventDefault();
        if (!formData.email == email || !formData.password == password) {
            alert("Email or Password incorrect!");
            return;
        }
        setLoggedIn(true);
        navigate("/movies/genre/28");
    };

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
            </div>
        </div>
    );
}
export default LoginView;