import { notifications } from "@mantine/notifications";
import { callAPI } from "./remoto/callAPI";
import { UserApiKeyBody, UserApiKeyResponse, UserChangeNameBody, UserChangeNameResponse, UserChangePasswordBody, UserChangePasswordResponse, Usuario } from "./remoto/types";

export const getSelf = async () => {
    return await callAPI<Usuario, undefined>("GET", "/api/users/self", {})
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

export const hasApiKey = async () => {
    return await callAPI<boolean, undefined>("GET", "/api/users/hasApiKey", {})
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

export const setNombre = async (nuevoNombre: string) => {
    return await callAPI<UserChangeNameResponse, UserChangeNameBody>("PATCH", "/api/users/changeName", {
        "body": {
            "nombre": nuevoNombre
        }
    })
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

export const changePassword = async (nuevaContraseña: string, viejaContraseña: string) => {
    return await callAPI<UserChangePasswordResponse, UserChangePasswordBody>("PATCH", "/api/users/changePassword", {
        "body": {
            "password": nuevaContraseña,
            "oldPassword": viejaContraseña
        }
    })
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

export const apiKey = async (apikey: string) => {
    return await callAPI<UserApiKeyResponse, UserApiKeyBody>("PATCH", "/api/users/apiKey", {
        "body": {
            "apiKey": apikey
        }
    })
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

export const API_USER = {
    getSelf, hasApiKey, setNombre, changePassword, apiKey
}