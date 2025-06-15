import { useStoreContext } from "../context/user";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../src/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import "./SettingsView.css";

function SettingsView() {
    const { user, setUser, choices, setChoices, genres, prevPurchase } = useStoreContext();
    const [formData, setFormData] = useState({
        firstName: user?.displayName?.split(" ")[0] || "",
        lastName: user?.displayName?.split(" ")[1] || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        selectedGenres: [],
    });
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    const checkboxesRef = useRef({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.providerData) {
            const isGoogle = user.providerData.some((provider) => provider.providerId === "google.com");
            setIsGoogleUser(isGoogle);
        }
    }, [user]);

    async function changeName(e) {
        e.preventDefault();

        try {
            const currentUser = auth.currentUser;
            await updateProfile(currentUser, {
                displayName: `${formData.firstName} ${formData.lastName}`,
            });

            setUser((prevUser) => ({
                ...prevUser,
                displayName: `${formData.firstName} ${formData.lastName}`,
            }));

            alert("Name successfully updated!");
        } catch (error) {
            console.error("Error updating name:", error);
            alert("Failed to update name. Please try again.");
        }
    }

    async function changePassword(e) {
        e.preventDefault();

        const currentUser = auth.currentUser;
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Your Passwords Do Not Match! Please Try Again!");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(currentUser.uid, formData.currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
        } catch (error) {
            alert("Failed to update password. Please check your current password and try again.");
            return;
        }

        try {
            await updatePassword(currentUser, formData.newPassword);
            alert("Password successfully updated!");
            setFormData({ ...formData, newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password. Please try again.");
        }
    }

    async function updateGenres(e) {
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

        setChoices(sortedGenres);
        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, { choices: sortedGenres }, { merge: true });

        alert("Genres successfully updated!");
    }

    async function goBack() {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        const genres = userDoc.data()?.choices || [];
        navigate(`/movies/genre/${genres[0].id}`);
    }

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>
            <div className="profile-section">
                <h1>Profile Information</h1>
                {isGoogleUser ? (
                    <div className="change-name">
                        <h2>You're signed in with Google</h2>
                        <label>
                            First Name:
                        </label>
                        <input
                            type="text"
                            placeholder={user.displayName?.split(" ")[0] || "First Name"}
                            value={formData.firstName}
                            readOnly
                        />
                        <label>
                            Last Name:
                        </label>
                        <input
                            type="text"
                            placeholder={user.displayName?.split(" ")[1] || "Last Name"}
                            value={formData.lastName}
                            readOnly
                        />
                    </div>
                ) : (
                    <form className="change-name" onSubmit={changeName}>
                        <label>
                            First Name:
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                        <label>
                            Last Name:
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                        <button type="submit" className="update-button">
                            Update Name
                        </button>
                    </form>
                )}

                <br />
                {isGoogleUser ? (
                    <></>
                ) : (
                    <div className="password">
                        <h1 className="password-title"> Change Password</h1>
                        <form className="change-password" onSubmit={changePassword}>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                            <button type="submit" className="update-button">
                                Update Password
                            </button>
                        </form>
                    </div>
                )}
                <br />

                <div className="genre-selection">
                    <h2>Please select at least 5 genres!</h2>
                    {genres?.map((item) => {
                        // Use choices from context to determine checked state
                        const isChecked = choices?.some(choice => choice.id === item.id);
                        return (
                            <div key={item.id}>
                                <input
                                    type="checkbox"
                                    ref={(el) => { checkboxesRef.current[item.id] = el; }}
                                    checked={isChecked}
                                    onChange={() => {
                                        // Update choices in state and persist to Firestore
                                        let updatedChoices;
                                        if (isChecked) {
                                            updatedChoices = choices.filter(choice => choice.id !== item.id);
                                        } else {
                                            updatedChoices = [...choices, item];
                                        }
                                        setChoices(updatedChoices);
                                        // Persist to Firestore
                                        const docRef = doc(firestore, "users", user.uid);
                                        setDoc(docRef, { choices: updatedChoices }, { merge: true });
                                    }}
                                    style={{ cursor: "pointer" }}
                                />
                                <label className="genre-name">{item.genre}</label>
                            </div>
                        );
                    })}
                    <br />
                    <button onClick={updateGenres} className="update-button">
                        Update Genres
                    </button>
                </div>
                <div className="back-button">
                    <button onClick={goBack}>
                        Go Back
                    </button>
                </div>

                <div className="previous-purchases">
                    <h2>Previous Purchases</h2>
                    {prevPurchase.entrySeq().map(([id, movie]) => (
                        <div key={id} className="purchase-item">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.original_title}
                            />
                            <p>{movie.original_title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default SettingsView;


