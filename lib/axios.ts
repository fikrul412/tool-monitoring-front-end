import axios from "axios";

export const api = axios.create({
    // Route API requests through the frontend origin. This keeps the
    // HttpOnly auth cookie first-party in browsers that block third-party
    // cookies (notably Safari and private browsing sessions).
    baseURL: "/api",
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
