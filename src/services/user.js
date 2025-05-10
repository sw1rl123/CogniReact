import axios from "axios"

const API_URL = "https://localhost:7055";

const $api = axios.create({
    baseURL: API_URL,
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
    try {
        const userId = localStorage.getItem('userId');
        const response = await $api.get(`${API_URL}/Token/Refresh`, { params: { id: userId} });
        var aToken = response.data.accessToken;
        localStorage.setItem("aToken", aToken);
        return aToken;
    } catch (error) {
        console.error("Ошибка при обновлении токена:", error);
    }
};

$api.interceptors.response.use((config) => {
    if(config) {
        return config;
    };
}, async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
        if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return $api.request(originalRequest);
            } catch (e) {
                console.error("Не удалось обновить токен. Переход на логин.");
            }
        }
    }
});

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

export const createNewArticle = async (userId, articleName, articleBody, articleImg) => {
    try {
        let formData = new FormData();
        formData.append('articleName', articleName);
        formData.append('articleBody', articleBody);
        formData.append('idUser', userId);

        
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
    try {
        var URL = "/Article/GetAllArticleIdsAndNames";
        let response = await $api.get(URL);
        return response;
    } catch(e) {
        console.error();
    }
}

export const getCurrentArticle = async (id) => {
    try {
        var URL = "/Article/GetArticleById?id=" + id;
        let response = await $api.get(URL);
        console.log(response);
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

export const updateImageBanner = async (Img) => {
    try {
        let formData = new FormData();

        formData.append('Picture', Img[0]);

        let response = await $api.put("/User/ChangeBanner", formData, { headers: { "Content-type": "multipart/form-data" },});
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const updateUserNickname = async (userName, userSurname) => {
    try {
        let formData = new FormData();

        formData.append("name", userName);
        formData.append("surname", userSurname);

        let response = await $api.put("/User/ChangeName", formData);
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const updateUserDescription = async (userDesc) => {
    try {
        let formData = new FormData();

        formData.append("description", userDesc);

        let response = await $api.put("/User/ChangeDescription", formData);
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const updateUserPassword = async (userOldPassword, userNewPassword) => {
    try {
        let formData = new FormData();

        formData.append("oldPassword", userOldPassword);
        formData.append("newPassword", userNewPassword);

        let response = await $api.put("/User/ChangePassword", formData);
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const updateUserMbti = async (mbti) => {
    try {
        let formData = new FormData();
        formData.append("mbtiType", mbti);

        let response = await $api.post("/User/SetTestResult", formData);
        return response;
    } catch(e) {
        console.log(e);
    }
}

