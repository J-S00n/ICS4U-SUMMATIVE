import { createContext, useContext, useState, useEffect } from "react";
import { Map } from "immutable";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebase";
import { firestore } from "../src/firebase";
import { doc, getDoc } from "firebase/firestore";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    setPersistence(auth, browserSessionPersistence);
    const [user, setUser] = useState(null);
    const [choices, setChoices] = useState(Map({}));
    const [cart, setCart] = useState(Map({}));
    const [prevPurchase, setPrevPurchase] = useState(Map({}));
    const [genres] = useState([
        { genre: "Action", id: 28 },
        { genre: "Adventure", id: 12 },
        { genre: "Animation", id: 16 },
        { genre: "Comedy", id: 35 },
        { genre: "Crime", id: 80 },
        { genre: "Family", id: 10751 },
        { genre: "Fantasy", id: 14 },
        { genre: "History", id: 36 },
        { genre: "Mystery", id: 9648 },
        { genre: "Science Fiction", id: 878 },
        { genre: "Thriller", id: 53 },
        { genre: "War", id: 10752 },
        { genre: "Western", id: 37 },
    ]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await loadUserData(firebaseUser.uid);
                loadCartFromStorage(firebaseUser.uid);
            } else {
                clearState();
            }
        });

        return () => unsubscribe();
    }, []);

    const loadUserData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(firestore, "users", userId));
            if (userDoc.exists()) {
                const genres = userDoc.data().choices;

                if (Array.isArray(genres)) {
                    setChoices(Map(genres.map(choice => [choice.id, choice])));
                }else {
                    setChoices(Map({}));
                }
                setPrevPurchase(Map(userDoc.data().prevPurchase || {}));
            } else {
                setChoices(Map({}));
                setPrevPurchase(Map({}));
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    const loadCartFromStorage = (userId) => {
        try {
            const storedCart = localStorage.getItem(`cart-${userId}`);
            setCart(storedCart ? Map(JSON.parse(storedCart)) : Map({}));
        } catch (error) {
            console.error("Error loading cart from storage:", error);
        }
    };

    const saveCartToStorage = () => {
        if (user?.uid) {
            localStorage.setItem(`cart-${user.uid}`, JSON.stringify(cart.toJS()));
        }
    };

    useEffect(() => {
        saveCartToStorage();
    }, [cart]);

    const clearState = () => {
        setChoices(Map({}));
        setCart(Map({}));
        setPrevPurchase(Map({}));
    };

    return (
        <StoreContext.Provider value={{
            user, setUser, cart, setCart, choices, setChoices, genres, prevPurchase, setPrevPurchase
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => useContext(StoreContext);

