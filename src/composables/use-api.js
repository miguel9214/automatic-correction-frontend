import axios from 'axios';

export const useApi = async function (url, method = 'GET', payload = {}) { 
    url = `http://automatic-correction-backend.test/api/${url}`;

    try {
        let headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
        };

        const token = localStorage.getItem("access_token");
        if (token) headers.Authorization = `Bearer ${token}`;

        const config = {
            method: method,
            url: url,
            data: payload,
            headers: headers,
        };

        const response = await axios(config);
        return response.data;

    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401 || (status === 500 && data.message === "Token has expired")) {
                localStorage.removeItem("access_token"); // 🔥 Ahora elimina el token correcto
                window.location.replace("/login"); // 🔄 Usa replace para evitar el historial incorrecto
            } else {
                throw data;
            }
        } else {
            console.error("Error en la API:", error);
            throw new Error("Error en la conexión con el servidor.");
        }
    }
};
