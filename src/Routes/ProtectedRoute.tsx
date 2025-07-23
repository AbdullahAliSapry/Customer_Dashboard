// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";
// import { RootState } from "../Store/Store";
// import { login, logout } from "../Store/DashBoardSlice/AuthSlice";
// import Cookies from 'js-cookie';
// import { useEffect, useState, useRef } from "react";

// const decodeToken = (token: string) => {
//     try {
//         const base64Url = token.split('.')[1];
//         if (!base64Url) return null;
        
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = atob(base64);
//         return JSON.parse(jsonPayload);
//     } catch (error) {
//         console.error("Token decode error:", error);
//         return null;
//     }
// };

// const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
//     const [isChecking, setIsChecking] = useState(true);
//     const location = useLocation();
//     const authCheckPerformed = useRef(false);
    
//     const dispatch = useDispatch();
//     const {isauthenticated, user} = useSelector((state: RootState) => state.Auth);
    
//     // Get auth data from cookies/localStorage once on component mount
//     const userinCookie = Cookies.get("user");
//     const isAuthenticatedinCookie = Cookies.get("isAuthenticated");
//     const storedToken = localStorage.getItem("token");
    
//     useEffect(() => {
//         // Skip if we've already performed the auth check to prevent loops
//         if (authCheckPerformed.current) {
//             setIsChecking(false);
//             return;
//         }
        
//         const checkAuth = () => {
//             if (userinCookie && isAuthenticatedinCookie && storedToken) {
//                 try {
//                     const userData = JSON.parse(userinCookie);
//                     const isAuthValue = isAuthenticatedinCookie === "true";
                    
//                     // If token exists but userData doesn't have it, add it
//                     if (storedToken && (!userData.token || userData.token !== storedToken)) {
//                         userData.token = storedToken;
//                     }

//                     // Validate token expiration
//                     const decodedToken = decodeToken(storedToken);
//                     let tokenExpired = false;
                    
//                     if (decodedToken && decodedToken.exp) {
//                         const expTime = decodedToken.exp * 1000; // convert to milliseconds
//                         tokenExpired = Date.now() > expTime;
//                     }
                    
//                     if (tokenExpired) {
//                         // Token expired, log out user
//                         console.log("Token expired, logging out");
//                         dispatch(logout());
//                     } else if (!user || !isauthenticated) {
//                         // User data exists in cookies but not in Redux store
//                         console.log("Restoring user from cookies");
//                         dispatch(login({
//                             data: userData,
//                             isAuthenticated: isAuthValue
//                         }));
//                     }
//                 } catch (e) {
//                     console.error("Error parsing cookie data:", e);
//                     // Clear invalid data
//                     Cookies.remove("user", { path: '/' });
//                     Cookies.remove("isAuthenticated", { path: '/' });
//                     localStorage.removeItem("token");
//                     dispatch(logout());
//                 }
//             } else if ((!userinCookie || !storedToken) && (user || isauthenticated)) {
//                 // Cookies were cleared but Redux state wasn't
//                 console.log("Cookies cleared, logging out");
//                 dispatch(logout());
//             }
            
//             // Mark auth check as completed
//             authCheckPerformed.current = true;
//             setIsChecking(false);
//         };
        
//         checkAuth();
//     }, [dispatch]);
    
//     // Show nothing while checking authentication
//     if (isChecking) {
//         return <div className="flex items-center justify-center h-screen">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
//         </div>;
//     }
    
//     // Redirect to login if not authenticated
//     if (!isauthenticated || !user) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }
    
//     // Render the protected content
//     return <>{children}</>;
// };

// export default ProtectedRoute;



import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../Store/Store";
import { login, logout } from "../Store/DashBoardSlice/AuthSlice";
import Cookies from 'js-cookie';
import { useEffect, useState, useRef } from "react";
import { useTranslation } from 'react-i18next';

const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
};

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { t } = useTranslation();
    const [isChecking, setIsChecking] = useState(true);
    const location = useLocation();
    const authCheckPerformed = useRef(false);
    
    const dispatch = useDispatch();
    const {isauthenticated, user} = useSelector((state: RootState) => state.Auth);
    
    // Get auth data from cookies/localStorage once on component mount
    const userinCookie = Cookies.get("user");
    const isAuthenticatedinCookie = Cookies.get("isAuthenticated");
    const storedToken = localStorage.getItem("token");
    
    useEffect(() => {
        // Skip if we've already performed the auth check to prevent loops
        if (authCheckPerformed.current) {
            setIsChecking(false);
            return;
        }
        
        const checkAuth = () => {
            if (userinCookie && isAuthenticatedinCookie && storedToken) {
                try {
                    const userData = JSON.parse(userinCookie);
                    const isAuthValue = isAuthenticatedinCookie === "true";
                    
                    // If token exists but userData doesn't have it, add it
                    if (storedToken && (!userData.token || userData.token !== storedToken)) {
                        userData.token = storedToken;
                    }

                    // Validate token expiration
                    const decodedToken = decodeToken(storedToken);
                    let tokenExpired = false;
                    
                    if (decodedToken && decodedToken.exp) {
                        const expTime = decodedToken.exp * 1000; // convert to milliseconds
                        tokenExpired = Date.now() > expTime;
                    }
                    
                    if (tokenExpired) {
                        // Token expired, log out user
                        console.log(t('auth.token_expired'));
                        dispatch(logout());
                    } else if (!user || !isauthenticated) {
                        // User data exists in cookies but not in Redux store
                        console.log(t('auth.restoring_user'));
                        dispatch(login({
                            data: userData,
                            isAuthenticated: isAuthValue
                        }));
                    }
                } catch (e) {
                    console.error(t('auth.error_parsing_cookie'), e);
                    // Clear invalid data
                    Cookies.remove("user", { path: '/' });
                    Cookies.remove("isAuthenticated", { path: '/' });
                    localStorage.removeItem("token");
                    dispatch(logout());
                }
            } else if ((!userinCookie || !storedToken) && (user || isauthenticated)) {
                // Cookies were cleared but Redux state wasn't
                console.log(t('auth.cookies_cleared'));
                dispatch(logout());
            }
            
            // Mark auth check as completed
            authCheckPerformed.current = true;
            setIsChecking(false);
        };
        
        checkAuth();
    }, [dispatch, t]);
    
    // Show nothing while checking authentication
    if (isChecking) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-gray-600">{t('auth.loading')}</span>
        </div>;
    }
    
    // Redirect to login if not authenticated
    if (!isauthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Render the protected content
    return <>{children}</>;
};

export default ProtectedRoute;