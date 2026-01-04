import type { paths } from "./schema";

export type AuthRegisterBody = paths["/api/auth/register"]["post"]["requestBody"]["content"]["application/json"];
export type AuthRegisterResponse = paths["/api/auth/register"]["post"]["responses"]["200"]["content"]["application/json"];

export type AuthLoginBody = paths["/api/auth/login"]["post"]["requestBody"]["content"]["application/json"];
export type AuthLoginResponse = paths["/api/auth/login"]["post"]["responses"]["200"]["content"]["application/json"];

export type AuthRefreshBody = paths["/api/auth/refresh"]["post"]["requestBody"]["content"]["application/json"];
export type AuthRefreshResponse = paths["/api/auth/refresh"]["post"]["responses"]["200"]["content"]["application/json"];

export type Usuario /* UserSelfResponse */ = paths["/api/users/self"]["get"]["responses"]["200"]["content"]["application/json"];
export type Proyecto = Usuario["proyectos"][number];
export type Mensaje = Proyecto["mensajes"][number];

export type UserChangeNameBody = paths["/api/users/changeName"]["patch"]["requestBody"]["content"]["application/json"];
export type UserChangeNameResponse = paths["/api/users/changeName"]["patch"]["responses"]["200"]["content"]["application/json"];

export type UserChangePasswordBody = paths["/api/users/changePassword"]["patch"]["requestBody"]["content"]["application/json"];
export type UserChangePasswordResponse = paths["/api/users/changePassword"]["patch"]["responses"]["200"]["content"]["application/json"];

export type UserApiKeyBody = paths["/api/users/apiKey"]["patch"]["requestBody"]["content"]["application/json"];
export type UserApiKeyResponse = paths["/api/users/apiKey"]["patch"]["responses"]["200"]["content"]["application/json"];

export type ProyectosCreateBody = paths["/api/proyectos/"]["post"]["requestBody"]["content"]["application/json"];
export type ProyectosCreateResponse = paths["/api/proyectos/"]["post"]["responses"]["200"]["content"]["application/json"];

export type ProyectosUpdateBody = paths["/api/proyectos/{idProyecto}"]["put"]["requestBody"]["content"]["application/json"];
export type ProyectosUpdateResponse = paths["/api/proyectos/{idProyecto}"]["put"]["responses"]["200"]["content"]["application/json"];

export type ProyectosUpdateBody = paths["/api/proyectos/{idProyecto}"]["put"]["requestBody"]["content"]["application/json"];
export type ProyectosUpdateResponse = paths["/api/proyectos/{idProyecto}"]["put"]["responses"]["200"]["content"]["application/json"];

export type ProyectosDeleteResponse = paths["/api/proyectos/{idProyecto}"]["delete"]["responses"]["200"]["content"]["application/json"];

export type ProyectosSendMessageBody = paths["/api/proyectos/{idProyecto}/sendMessage"]["post"]["requestBody"]["content"]["application/json"];
export type ProyectosSendMessageResponse = paths["/api/proyectos/{idProyecto}/sendMessage"]["post"]["responses"]["200"]["content"]["application/json"];

export type ProyectosGenerarIdeaResponse = paths["/api/proyectos/{idProyecto}/generarIdea"]["post"]["responses"]["200"]["content"]["application/json"];