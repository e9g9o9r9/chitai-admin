import axios from 'axios';

const requestAxios = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 10000,
});

requestAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

requestAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Доступ запрещен');
                    break;
                case 404:
                    console.error('Ресурс не найден');
                    break;
                case 500:
                    console.error('Ошибка сервера');
                    break;
                default:
                    console.error('Произошла ошибка');
            }
        } else if (error.request) {
            console.error('Нет ответа от сервера');
        } else {
            console.error('Ошибка при настройке запроса', error.message);
        }

        return Promise.reject(error);
    }
);

export default requestAxios;