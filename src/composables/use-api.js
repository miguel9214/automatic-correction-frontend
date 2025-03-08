import axios from 'axios';

export const useApi = async function (url, method = 'GET', payload = {}) {
    // Usar la variable de entorno
    const baseUrl = import.meta.env.VITE_API_URL;
    const fullUrl = `${baseUrl}/${url}`;
    
    try {
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const token = localStorage.getItem("access_token");
        if (token) headers.Authorization = `Bearer ${token}`;
        
        const config = {
            method: method,
            url: fullUrl,
            data: payload,
            headers: headers,
        };
        
        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401 || (status === 500 && data.message === "Token has expired")) {
                localStorage.removeItem("access_token");
                throw { status, data, redirect: true };
            } else {
                throw data;
            }
        } else {
            console.error("Error en la API:", error);
            throw new Error("Error en la conexión con el servidor.");
        }
    }
};