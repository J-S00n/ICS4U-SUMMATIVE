import { useStoreContext } from "../context/user";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsView.css";

function SettingsView() {
    const { user, choices, setChoices, genres } = useStoreContext();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        selectedGenres: [],
    });

    const checkboxesRef = useRef({});
    const navigate = useNavigate();

    function handleSettingChange(e) {
        e.preventDefault();

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

        alert("Successfully updated!");
        setFirstName(formData.firstName);
        setLastName(formData.lastName);
        setChoices(sortedGenres);
        navigate("/movies/genre/28");
    }

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>
            <form onSubmit={handleSettingChange} className="settings-form">
                <label>
                    First Name:
                </label>
                <input
                    type="text"
                    placeholder={firstName}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                />
                <label>
                    Last Name:
                </label>
                <input
                    type="text"
                    placeholder={lastName}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                />
                <label>
                    Email:
                </label>
                <input
                    type="email"
                    placeholder={email}
                    readOnly
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
                <button type="submit">Save</button>
            </form>
        </div>
    );
}
export default SettingsView;


