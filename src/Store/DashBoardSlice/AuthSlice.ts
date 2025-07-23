import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Set cookie options with expiration time (30 days)
const cookieOptions = {
    expires: 30,
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax' as const // Changed from strict to lax for better cross-domain behavior
};

const userinCookie = Cookies.get("user");
const isAuthenticatedinCookie = Cookies.get("isAuthenticated");
const storedToken = localStorage.getItem("token");

const intialState = {
    isauthenticated: isAuthenticatedinCookie === "true",
    user: userinCookie ? JSON.parse(userinCookie) : null,
    isLoading: false
};

// Check if we have a token but not user data (fix inconsistent state)
if (storedToken && !intialState.user) {
    // We'll let the ProtectedRoute component handle this case
    intialState.isauthenticated = false;
}

const AuthSlice = createSlice({
    name: "auth",
    initialState: intialState,
    reducers: {
        login(state, action) {
            // Handle the nested structure in the response
            const payload = action.payload;
            
            if (payload.data) {
                // If it's the full response with a nested data property
                state.isauthenticated = true;
                state.user = {
                    email: payload.data.email,
                    token: payload.data.token,
                    userId: payload.data.userId,
                    roles: payload.data.roles,
                    isAuthenticated: payload.data.isAuthenticated,
                    isSuccess: payload.data.isSuccess,
                    acessTokenExpiresOn: payload.data.acessTokenExpiresOn,
                    refreshTokenExpiresOn: payload.data.refreshTokenExpiresOn
                };
                
                // Store in cookies and localStorage with expiration
                Cookies.set("user", JSON.stringify(state.user), cookieOptions);
                Cookies.set("isAuthenticated", "true", cookieOptions);
                localStorage.setItem("token", payload.data.token);
            } else {
                // If it's already the data object (for backward compatibility)
                state.isauthenticated = true;
                state.user = action.payload;
                Cookies.set("user", JSON.stringify(action.payload), cookieOptions);
                if (action.payload.token) {
                    localStorage.setItem("token", action.payload.token);
                    Cookies.set("isAuthenticated", "true", cookieOptions);
                }
            }
        },
        logout(state) {
            state.isauthenticated = false;
            state.user = null;
            Cookies.remove("user", { path: '/' });
            Cookies.remove("isAuthenticated", { path: '/' });
            localStorage.removeItem("token");
        }
    }
});

export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
