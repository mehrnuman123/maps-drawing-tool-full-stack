import axios from 'axios';
import { createCookies, getCookies } from '@/utils/Cookies';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register/`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login/`, { username, password });
        createCookies(response?.data?.access)
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};


export const AuthenticatedUser = async () => {
    try {
        const token = await getCookies()
        const response = await axios.get(`${API_BASE_URL}/me/`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};


export const saveDrawingShapes = async (drawings) => {
    try {
        const token = await getCookies()
        const response = await axios.post(
            `${API_BASE_URL}/drawings/`, { drawing: drawings },
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating drawing:', error);
        throw error;
    }
};
