export interface AuthModel {
    email: string;
    token: string;
    roles: string[];
    userId: string;
    isAuthenticated: boolean;
    isSuccess: boolean;
    refreshTokenExpiresOn: string;
    acessTokenExpiresOn: string;
}

export interface AuthInterface {
    isauthenticated: boolean;
    user: AuthModel | null;
    isLoading: boolean;
    error: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  role: string;
  isAuthenticated: boolean;
  isSuccess: boolean;
  refreshTokenExpiresOn?: string;
  accessTokenExpiresOn?: string;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
