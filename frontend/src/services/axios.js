import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3005",
    // baseURL: "http://localhost:3005",
    withCredentials: true
});

export default api;
