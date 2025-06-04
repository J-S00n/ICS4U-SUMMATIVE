import { createContext, useContext, useState } from "react";
import { Map } from "immutable";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [choices, setChoices] = useState(Map({}));
    const [cart, setCart] = useState(Map({}));
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
    
    return (
        <StoreContext.Provider value={{ 
            user, setUser, cart, setCart, choices, setChoices, genres, setGenres,}}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(StoreContext);
}
