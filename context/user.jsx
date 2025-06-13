import { createContext, useContext, useState, useEffect } from "react";
import { get, Map, set } from "immutable";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebase";
import { firestore } from "../src/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [choices, setChoices] = useState(Map({}));
    const [cart, setCart] = useState(Map({}));
    const [prevPurchase, setPrevPurchase] = useState(Map({}));
    const [genres, setGenres] = useState([
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
        { genre: "Westerm", id: 37 },
    ]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                const sessionCart = sessionStorage.getItem(user.uid);
                if (sessionCart) {
                    setCart(Map(JSON.parse(sessionCart)));
                } else {
                    setCart(Map({}));
                }
                const getPrevPurchase = async () => {
                    try {
                        const docRef = doc(firestore, "users", user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const prevCart = Map(docSnap.data().prevPurchase);
                            setPrevPurchase(prevCart);
                        } else {
                            setPrevPurchase(Map({}));
                        }
                    } catch (error) {
                        console.log(error);
                    }
                };
                getPrevPurchase();
                
                const getGenres = async () => {
                    try {
                        const docRef = doc(firestore, "users", user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const genres = docSnap.data().choices;
                            setChoices(Map(genres));

                        }
                    } catch (error) {
                        console.log(error);
                    }
                };
                getGenres();
            }
        });
    }, [auth]);

    return (
        <StoreContext.Provider value={{
            user, setUser, cart, setCart, choices, setChoices, genres, setGenres, prevPurchase, setPrevPurchase
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(StoreContext);
}
