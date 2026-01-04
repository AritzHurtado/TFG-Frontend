import { useSyncExternalStore } from "react";
import { callAPI } from "./remoto/callAPI";
import { AuthLoginBody, AuthLoginResponse, AuthRefreshBody, AuthRefreshResponse, AuthRegisterBody, AuthRegisterResponse } from "./remoto/types";

const register = async (usuario: string, contraseña: string) => {
    const session = await callAPI<AuthRegisterResponse, AuthRegisterBody>("POST", "/api/auth/register", {
        "body": {
            "nombre": usuario,
            "password": contraseña
        }
    }, false);
    setAccessToken(session);
    document.dispatchEvent(new Event("login"))
    return session;
}

const logIn = async (usuario: string, contraseña: string) => {
    const session = await callAPI<AuthLoginResponse, AuthLoginBody>("POST", "/api/auth/login", {
        "body": {
            "nombre": usuario,
            "password": contraseña
        }
    }, false);
    setAccessToken(session);
    document.dispatchEvent(new Event("login"))
    return session;
}

const refresh = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    const session = await callAPI<AuthRefreshResponse, AuthRefreshBody>("POST", "/api/auth/refresh", {
        "body": {
            "refresh_token": refreshToken
        }
    }, false)
    setAccessToken({
        ...session,
        "refresh_token": refreshToken
    });
    document.dispatchEvent(new Event("login"))
    return session;
}

export const isLoggedIn = () => Boolean(getAccessToken());

export const getAccessToken = () => {
    const expireDate = localStorage.getItem("expire_date");
    if (!expireDate || new Date(expireDate) < new Date()) {
        return null;
    }
    return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
};

const setAccessToken = (login: AuthLoginResponse) => {
    localStorage.setItem("access_token", login.access_token);
    localStorage.setItem("refresh_token", login.refresh_token);
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 10);
    localStorage.setItem("expire_date", expireDate.toISOString());
}

export const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expire_date");
    document.dispatchEvent(new Event("logout"));
}

export const useAuthenticated = () => {
    return useSyncExternalStore((callback) => {
        document.addEventListener("login", callback);
        document.addEventListener("logout", callback);

        return () => {
            document.removeEventListener("login", callback);
            document.removeEventListener("logout", callback);
        };
    }, () => Boolean(getAccessToken()));
};

export const API_AUTH = {
    register, logIn, refresh
}