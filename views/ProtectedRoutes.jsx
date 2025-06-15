import { Outlet, Navigate } from "react-router-dom";
import { useStoreContext } from "../context/user.jsx";

function ProtectedRoutes() {

    const loggedIn = true;
    //useStoreContext();
    // const isLoginView = location.pathname === "/login";

    return (
        loggedIn ? <Outlet /> : <Navigate to="/login" />
    );
}

export default ProtectedRoutes;