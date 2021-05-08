import Router, { useRouter } from 'next/router';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { parseCookies, setCookie } from 'nookies';

import { api } from '../services';
import { removeAuthTokens } from '../utils';
import { User } from '../types';

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

export const signOut = () => {
  removeAuthTokens();

  Router.push('/');
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const getUserData = async () => {
      const { '@Authentication:token': token } = parseCookies();

      if (token) {
        try {
          const response = await api.get('/me');

          const { email, permissions, roles } = response.data;

          setUser({
            email,
            permissions,
            roles,
          });
        } catch (err) {
          signOut();
        }
      }
    };

    getUserData();
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, '@Authentication:token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      setCookie(undefined, '@Authentication:refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers.Authorization = `Bearer ${token}`;

      router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
