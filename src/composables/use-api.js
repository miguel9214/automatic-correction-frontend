import axios from 'axios';

export const useApi = async function (url, method = 'GET', payload = {}) {
    // Determinar automáticamente la URL base basada en el entorno actual
    let baseUrl;
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('.test')) {
        baseUrl = 'http://automatic-correction-backend.test/api';
    } else {
        baseUrl = 'https://automatic-correction-backend-production.up.railway.app/api';
    }
    
    const fullUrl = `${baseUrl}/${url}`;
    console.log("URL utilizada:", fullUrl);
    
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
                localStorage.removeItem("access_token"); // Elimina el token expirado o inválido
                throw { status, data, redirect: true }; // Lanza un error con un flag de redirección
            } else {
                throw data; // Lanza el error para que sea manejado por el componente
            }
        } else {
            console.error("Error en la API:", error);
            throw new Error("Error en la conexión con el servidor.");
        }
    }
};