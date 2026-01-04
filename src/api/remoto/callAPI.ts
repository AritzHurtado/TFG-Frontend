import { API_AUTH, getAccessToken } from "../Auth";

export async function callAPI<T, V>(type: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", url: string, data: { body?: V }, useAuth = true): Promise<T> {
	let token: string | null;
	if (useAuth) {
		token = getAccessToken();
		if (!token) {
			const result = await API_AUTH.refresh();
			if (result) {
				token = getAccessToken();
			} else {
				throw new ResponseError({
					status: 0,
					messageKey: "SESSION_EXPIRED",
					message: "Por favor, inicia sesión de nuevo.",
				});
			}
		}
	} else {
		token = null;
	}

	const controller = new AbortController();
	const bearerHeader = token ? { "Authorization": "Bearer " + token } : null;
	const bodyHeader = data.body ? { "Content-Type": "application/json; charset=utf-8" } : null;

	const options: RequestInit = {
		method: type,
		headers: {
			...bearerHeader,
			...bodyHeader,
		},
		signal: controller.signal,
	};

	if (data.body !== null) options.body = JSON.stringify(data.body);


	try {
		const idTimeout = setTimeout(() => controller.abort(), 10_000);
		const response = await fetch(apiURL(url), options);
		const responseText = await response.text();
		clearTimeout(idTimeout);

		if (response.ok) {
			const result = JSON.parse(responseText) as T;
			return result;
		} else {
			const result = JSON.parse(responseText) as ResponseError;
			throw new ResponseError({
				message: result.message,
				status: response.status,
				messageKey: result.messageKey
			});
		}
	} catch (error) {
		if (error instanceof DOMException) {
			switch (error.name) {
				case "AbortError":
					throw new ResponseError({
						status: 0,
						messageKey: "ABORT",
						message: "The request was aborted due to a call to the AbortController abort() method",
						originalError: error,
					});
				case "NotAllowedError":
					throw new ResponseError({
						status: 0,
						messageKey: "NOT_ALLOWED",
						message: "Thrown if use of the Topics API is specifically disallowed by a browsing-topics Permissions Policy, and a fetch() request was made with browsingTopics: true.",
						originalError: error,
					});
			}
		}
		if (error instanceof TypeError) {
			if (navigator.onLine === false) {
				throw new ResponseError({
					status: 0,
					messageKey: "NETWORK_ERROR",
					message: "Not online",
					originalError: error,
				});
			}

			throw new ResponseError({
				status: 0,
				messageKey: "NETWORK_ERROR",
				message: "Unknow network error",
				originalError: error,
			});
		}

		if (error instanceof Error)
			throw new ResponseError({
				status: 0,
				messageKey: "API_ERROR",
				message: error.message,
				originalError: error,
			});

		throw new ResponseError({
			status: 0,
			messageKey: "UNKNOWN_ERROR",
			message: "Unknown error on the fetch API"
		});
	}

}

export function apiURL(path?: string) {
	return `https://tfg-backend-prod-production.up.railway.app${path ?? "/"}`
}

export class ResponseError extends Error {
	status: number;
	messageKey: string;
	errors?: string[];
	message: string;
	originalError?: Error;

	constructor(fromJson: Omit<ResponseError, "name">) {
		super(fromJson.message);
		this.name = "ResponseError";
		this.status = fromJson.status;
		this.messageKey = fromJson.messageKey;
		this.errors = fromJson.errors;
		this.message = fromJson.message;
		this.originalError = fromJson.originalError;
	}
}