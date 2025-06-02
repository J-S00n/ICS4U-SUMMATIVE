import { useNavigate } from "react-router-dom";

function Genres(props) {
    const navigate = useNavigate();

    const handleGenreClick = (genreId) => {
        navigate(`/movies/genre/${genreId}`);
    }

    return (
        <div className="genre-contianer">
            <ul>
                {props.genresList.map((item) => (
                    <li key={item.id} onClick={() => handleGenreClick(item.id)}>
                        {item.genre}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Genres;
