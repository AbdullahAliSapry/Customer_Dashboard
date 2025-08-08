import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AuthModel } from "../../interfaces/AuthInterface";
import { Cookies } from "react-cookie";





const cookies = new Cookies();
// Set cookie options with expiration time (30 days)


const dataAuthModel = cookies.get("user") ;

interface AuthState {
  isauthenticated: boolean;
  user: AuthModel | null;
  isLoading: boolean;
}

const intialState: AuthState = {
  isauthenticated: dataAuthModel ? true : false,
  user: dataAuthModel ? dataAuthModel : null,
  isLoading: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState: intialState,
  reducers: {
    login(state, action: PayloadAction<AuthModel>) {
     
        console.log(action.payload);
        state.isauthenticated = true;
        state.user = action.payload;
        cookies.set("user", action.payload, {
          path: "/",
          expires: new Date(
            action.payload.refreshTokenExpiresOn?.toString() ?? ""
          ),
        });
        cookies.set("token", action.payload.token, {
          path: "/",
          expires: new Date(
            action.payload.acessTokenExpiresOn?.toString() ?? ""
          ),
        });
      
    },

    logout(state) {
      state.isauthenticated = false;
      state.user = null;
      cookies.remove("user", { path: "/" });
      cookies.remove("token", { path: "/" });
      
    },
  },
});

export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
