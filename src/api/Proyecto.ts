import { notifications } from "@mantine/notifications";
import { callAPI } from "./remoto/callAPI";
import { ProyectosCreateBody, ProyectosCreateResponse, ProyectosDeleteResponse, ProyectosGenerarIdeaResponse, ProyectosSendMessageBody, ProyectosSendMessageResponse, ProyectosUpdateBody } from "./remoto/types";

const crear = async (proyectoData: ProyectosCreateBody) => {
    return await callAPI<ProyectosCreateResponse, ProyectosCreateBody>(
        "POST",
        "/api/proyectos/",
        {
            "body": proyectoData
        }
    )
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

const editar = async (idProyecto: number, proyectoData: ProyectosUpdateBody) => {
    return await callAPI<ProyectosUpdateBody, ProyectosUpdateBody>(
        "PUT",
        `/api/proyectos/${idProyecto}`,
        {
            "body": proyectoData
        }
    )
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

const eliminar = async (idProyecto: number) => {
    return await callAPI<undefined, ProyectosDeleteResponse>(
        "DELETE",
        `/api/proyectos/${idProyecto}`,
        {}
    )
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

const enviarMensaje = async (idProyecto: number, mensaje: ProyectosSendMessageBody) => {
    return await callAPI<ProyectosSendMessageResponse, ProyectosSendMessageBody>(
        "POST",
        `/api/proyectos/${idProyecto}/sendMessage`,
        {
            body: mensaje
        }
    )
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

const generarIdea = async (idProyecto: number) => {
    return await callAPI<ProyectosGenerarIdeaResponse, undefined>(
        "POST",
        `/api/proyectos/${idProyecto}/generarIdea`,
        {}
    )
        .catch(e => {
            notifications.show({
                message: e?.message ?? "Error desconocido",
                color: "red"
            });
            return null;
        });
};

export const API_PROYECTO = {
    crear, editar, eliminar,
    enviarMensaje, generarIdea
}