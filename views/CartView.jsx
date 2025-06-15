import { useStoreContext } from "../context/user";
import { useNavigate } from "react-router-dom";
import { firestore } from "../src/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Map } from "immutable";
import "./CartView.css";

function CartView() {
    const { cart, setCart, user, prevPurchase, setPrevPurchase } = useStoreContext();
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

    async function handleCheckout() {
        const purchases = prevPurchase.merge(cart);
        setPrevPurchase(purchases);
        const docRef = doc(firestore, "users", user.email);
        try {
            await setDoc(docRef, {
                prevPurchase: purchases.toJS(),
            }, { merge: true });
            setCart(Map({})); // Clear the cart after checkout
            localStorage.removeItem(user.email);
            alert("Checkout successful! Thank you for your purchase!");
            navigate("/movies/genre/28");
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    }


    function removeCartItem(itemId) {
        setCart((prev) => {
            const newCart = prev.delete(itemId);
            localStorage.removeItem(user.email);
            localStorage.setItem(user.email, JSON.stringify(newCart.toJS()));
            return newCart;
        });
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
                                    removeCartItem(key);
                                }}
                            >
                                Remove from Cart
                            </button>
                        </div>
                    </div>
                );
            })}
            <button
                disabled={cart.size === 0}
                onClick={() => {
                    handleCheckout();
                }}
                className="checkout-button"
            >
                Checkout
            </button>
            <button
                onClick={() => navigate("/movies/genre/28")} className="cart-back-button">Back
            </button>
        </div>
    );
}

export default CartView;