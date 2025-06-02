import { useStoreContext } from "../context/user";
import { useNavigate } from "react-router-dom";
import "./CartView.css";

function CartView() {
    const { cart, setCart } = useStoreContext();
    const navigate = useNavigate();

    if (cart.size === 0) {
        return (
            <div className="empty-cart">
                <h1>Cart</h1>
                <p>Your cart is empty.</p>
                <button
                    onClick={() => navigate("/movies/genre/28")} className="cart-back-button">Back
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Cart</h1>
            {cart.entrySeq().map(([key, value]) => {
                return (
                    <div key={key} className="cart-item">
                        <img
                            className="cart-image"
                            src={`https://image.tmdb.org/t/p/w500${value.poster_path}`}
                            alt={value.title}
                        />
                        <div className="cart-details">
                            <h2>{value.title}</h2>
                            <p>{value.overview}</p>
                            <button
                                onClick={() => {
                                    setCart((prev) => prev.delete(value.id));
                                }}
                            >
                                Remove from Cart
                            </button>
                        </div>
                    </div>
                );
            })}
            <button
                onClick={() => navigate("/movies/genre/28")} className="cart-back-button">Back
            </button>
        </div>
    );
}

export default CartView;