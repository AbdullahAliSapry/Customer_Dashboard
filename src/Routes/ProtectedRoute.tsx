

import { Navigate, useLocation } from "react-router-dom";
import { Cookies } from "react-cookie";
const cookies = new Cookies();
const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const location = useLocation();
    
    // Simple check for user and token from cookies only
    const userInCookie = cookies.get("user");
    const tokenInCookie = cookies.get("token");
    
    // Redirect to login if user or token is missing
    if (!userInCookie || !tokenInCookie) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Render the protected content if both user and token exist
    return <>{children}</>;
};

export default ProtectedRoute;