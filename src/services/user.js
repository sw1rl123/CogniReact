import axios from "axios"
import { COGNI_API_URL } from "./globals";

const API_URL = "https://localhost:7055";

const $api = axios.create({
    baseURL: COGNI_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
});

$api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('aToken');
    const refreshToken = localStorage.getItem('rToken');

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
        config.headers["Refresh-Token"] = refreshToken;
    }

    return config;
});

const refreshAccessToken = async () => {
    const { data } = await $api.get("/Token/Refresh", { skipAuthRefresh: true });
    localStorage.setItem("aToken", data.accessToken);
    localStorage.setItem("rToken", data.refreshToken);
    return data.accessToken;
};

$api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || !originalRequest || originalRequest.skipAuthRefresh) {
        throw error;
    }

    originalRequest.skipAuthRefresh = true;
    try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    } catch (refreshError) {
        if (!originalRequest.preservePageOnAuthError) {
            console.error("Ошибка при обновлении токена:", refreshError);
            localStorage.removeItem("aToken");
            localStorage.removeItem("rToken");
            window.location.reload();
        }
        throw refreshError;
    }

    return $api.request(originalRequest);
});

export const getTagCatalog = () => $api.get("/UserTag/GetTagCatalog");

export const getUserTagSelection = (userId) =>
    $api.get("/UserTag/GetUserTagSelection", { params: { userId } });

export const setUserTagSelection = (selection) =>
    $api.put("/UserTag/SetUserTagSelection", selection);

export const getUserById = async (userId) => {
    try {
        let response = await $api.get("/User/GetUserById", { params: { id: userId } });
        return response;
    } catch(error) {
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

export const getUserFriendsFull = async (userId) => {
    try {
        var URL = "/Friend/GetUserFriends?id=" + userId;
        let response = await $api.get(URL);
        return response;
    } catch(e) {
        console.error();
    }
}

export const getAllUsers = async () => {
    try {
        var URL = "/User/GetRandomUsers";

        var data = {
            "startsFrom": 0,
            "limit": 25
          };

        let response = await $api.post(URL, data);
        return response;
    } catch(e) {
        console.error();
    }
}

export const getAllUsersChats = async (ids) => {
    try {
        var URL = "/User/GetUsersByIds";

        var data = ids;

        let response = await $api.post(URL, data);
        return response;
    } catch(e) {
        console.error();
    }
}


export const getUsersFromName = async (text, mbti) => {
    try {
        var URL = "/User/SearchUserByNameAndMbti";

        var data = {
            "name":  text,
            "mbtiType": mbti
          };

        let response = await $api.post(URL, data);
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
        let formData = new FormData();
        formData.append('postBody', postText);
        
        if(postImg) {
            postImg.map(file => formData.append('Files', file))
        }

        let response = await $api.post("/Post/CreatePost", formData, { headers: { "Content-type": "multipart/form-data" },});
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const subscribe = async (friendId) => {
    try {
        var URL = "/Friend/Subscribe?friendId=" + friendId;
        let response = await $api.post(URL);
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const unSubscribe = async (friendId) => {
    try {
        var URL = "/Friend/Unsubscribe?friendId=" + friendId;
        let response = await $api.post(URL);
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const checkSubscribe = async (friendId) => {
    try {
        var URL = "Friend/CheckSubscribe?friendId=" + friendId;
        let response = await $api.get(URL);
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const createNewArticle = async (userId, articleName, articleBody, articleImg, annotation) => {
    try {
        let formData = new FormData();
        formData.append('articleName', articleName);
        formData.append('articleBody', articleBody);
        formData.append('idUser', userId);
        formData.append('annotation', annotation);

        
        if(articleImg) {
            articleImg.map(file => formData.append('Files', file))
        }

        let response = await $api.post("/Article/CreateArticle", formData, { headers: { "Content-type": "multipart/form-data" },});
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const getAllArticles = async () => {
    let response = await $api.get("Article/GetArticlesPreviews", { timeout: 10000 });
    return response;
}

export const getCurrentArticle = async (id) => {
    try {
        var URL = "/Article/GetArticleById?id=" + id;
        let response = await $api.get(URL);
        return response;
    } catch(e) {
        console.error();
    }
}

export const updateImageAvatar = async (Img) => {
    try {
        let formData = new FormData();

        formData.append('Picture', Img[0]);

        let response = await $api.put("/User/ChangeAvatar", formData, { headers: { "Content-type": "multipart/form-data" },});
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const updateImageBanner = async (Img, onUploadProgress) => {
    let formData = new FormData();

    formData.append('Picture', Img[0]);

    let response = await $api.put("/User/ChangeBanner", formData, { headers: { "Content-type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onUploadProgress?.(percent);
            }
        }
    });
    
    return response.data;
}

export const removeImageBanner = async () => {
    const response = await $api.delete("/User/RemoveBanner/RemoveBanner");
    return response;
};

const profileUpdateConfig = { preservePageOnAuthError: true };

export const updateUserNickname = (userName, userSurname) => {
    return $api.put("/User/ChangeName", {
        name: userName,
        surname: userSurname,
    }, profileUpdateConfig);
};

export const updateUserDescription = (userDesc) => {
    return $api.put("/User/ChangeDescription", {
        description: userDesc,
    }, profileUpdateConfig);
};

export const updateUserPassword = (userOldPassword, userNewPassword) => {
    return $api.put("/User/ChangePassword", {
        oldPassword: userOldPassword,
        newPassword: userNewPassword,
    }, profileUpdateConfig);
};

export const updateUserMbti = async (mbti) => {
    try {
        let response = await $api.post("/User/SetTestResult", {
            mbtiType: mbti
        });
        return response;
    } catch(e) {
        console.error("Ощибка сохранения MBTI:", e);
        throw e;
    }
}
