import axios from "axios";

const api = axios.create({
<<<<<<< Updated upstream
    baseURL: process.env.NEXT_PUBLIC_DEVELOPMENT_URL,
=======
    baseURL: 'http://localhost:3000', // Proxy redirects this to 8000
>>>>>>> Stashed changes
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    // Check localStorage for token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;