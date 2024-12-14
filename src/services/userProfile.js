import axios from "axios"

const API_URL = "https://localhost:7055";

const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('aToken')}`
    config.headers["Refresh-Token"] = `${localStorage.getItem('rToken')}`
    return config;
});

const refreshAccessToken = async (userId) => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await $api.get(`${API_URL}/Token/Refresh`, { params: { id: userId} });
        var aToken = response.data;
        localStorage.setItem("aToken", aToken);
        return aToken;
    } catch (error) {
        console.error("Ошибка при обновлении токена:", error);
    }
};

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return $api.request(originalRequest);
        } catch (e) {
            console.error("Не удалось обновить токен. Переход на логин.");
        }
    }
});

export const getUserById = async (userId) => {
    try {
        let response = await $api.get("/User/GetUserById", { params: { id: userId } });
        return response;
    } catch(e) {
        console.error();
    }
}

export const getUserPosts = async (userId) => {
    try {
        var URL = "/Post/GetAllUserPost?id=" + userId;
        let response = await $api.post(URL);
        return response;
    } catch(e) {
        console.error();
    }
}

export const getUserFriends = async (userId) => {
    try {
        var URL = "/Friend/GetFriendsPreview?id=" + userId;
        let response = await $api.get(URL);
        return response;
    } catch(e) {
        console.error();
    }
}

export const getUserFriendsAmount = async (userId) => {
    try {
        var URL = "/Friend/GetNumOfFriends?id=" + userId;
        let response = await $api.get(URL);
        return response;
    } catch(e) {
        console.error();
    }
}

export const createPost = async (postText, postImg) => {
    try {
        const post = {
            postBody: postText,
            postImages: postImg
        }
        let response = await $api.post("/Post/CreatePost", post);
        return response;
    } catch(e) {
        console.log(e);
    }
}
