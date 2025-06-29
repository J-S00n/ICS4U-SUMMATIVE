import { Outlet, Navigate } from "react-router-dom";
import { useStoreContext } from "../context/user.jsx";
import { useEffect, useState } from "react";

function ProtectedRoutes() {
    const { user } = useStoreContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 100); 
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
