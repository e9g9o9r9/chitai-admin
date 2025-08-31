import { LoginCredentials, AuthResponse } from '../types/authTypes';
import requestAxios from '../api/requestAxios';

const API_URL = '/api';

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await requestAxios.post(`${API_URL}/auth/login/`, credentials);

    if (response.data.token) {
        requestAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
};

const logout = (): void => {
    delete requestAxios.defaults.headers.common['Authorization'];
};

const checkAuth = async (): Promise<AuthResponse> => {
    const response = await requestAxios.get(`${API_URL}check-auth/`);
    return response.data;
};

const authService = {
    login,
    logout,
    checkAuth,
};

export default authService;
