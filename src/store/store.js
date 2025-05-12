import { createUser, loginUser } from "../services/auth.js";
import { startSignalRConnection } from "../services/signalR.js";
import { getCurrentArticle } from "../services/user.js";
import { getAllArticles } from "../services/user.js";
import { createNewArticle } from "../services/user.js";
import { getUserById, getUserPosts, getUserFriends, getAllUsers, updateUserNickname, getUserFriendsFull, getUsersFromName, getUserFriendsAmount, createPost, updateImageAvatar, updateImageBanner, updateUserDescription, updateUserPassword, updateUserMbti } from "../services/user.js";

export default class Store {

    async register(user) {
        try {
            const response = await createUser(user);
            localStorage.setItem('aToken', response.data.accessToken);
            localStorage.setItem('rToken', response.data.refreshToken);
            localStorage.setItem('userId', response.data.id);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async login(user) {
        try {
            const response = await loginUser(user);
            if (response == 404) {
                return false;
            }
            else {
                localStorage.setItem('aToken', response.data.accessToken);
                localStorage.setItem('rToken', response.data.refreshToken);
                localStorage.setItem('userId', response.data.id);
                // startSignalRConnection(response.data.accessToken);
                return true;
            }
        } catch (e) {
            console.error(e);
            console.log(e.response.data);
        }
    }

    async logout() {
            localStorage.removeItem('aToken');
            localStorage.removeItem('rToken');
            localStorage.removeItem('userId');
    }

    async userInfo(userId) {
        try {
            const response = await getUserById(userId);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getPosts(userId) {
        try {
            const response = await getUserPosts(userId);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getFriends(userId) {
        try {
            const response = await getUserFriends(userId);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getFriendsFull(userId) {
        try {
            const response = await getUserFriendsFull(userId);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getAllUsers() {
        try {
            const response = await getAllUsers();
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getUsersFromName(text, mbti) {
        try {
            const response = await getUsersFromName(text, mbti);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getFriendsAmount(userId) {
        try {
            const response = await getUserFriendsAmount(userId);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async createPost(post, postImages) {
        try {
            const response = await createPost(post, postImages);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async createArticle(userId, articleName, articleBody) {
        try {
            const response = await createNewArticle(userId, articleName, articleBody);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async getArticles() {
        try {
            const response = await getAllArticles();
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async getArticle(id) {
        try {
            const response = await getCurrentArticle(id);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async updateImageAvatar(newImage) {
        try {
            const response = await updateImageAvatar(newImage);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async updateImageBanner(newImage) {
        try {
            const response = await updateImageBanner(newImage);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async updateUserName(userName, userSurname) {
        try {
            const response = await updateUserNickname(userName, userSurname);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async updateUserDesc(userDesc) {
        try {
            const response = await updateUserDescription(userDesc);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async updatePassword(userOldPassword, userNewPassword) {
        try {
            const response = await updateUserPassword(userOldPassword, userNewPassword);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    async updateMbti(mbti) {
        try {
            const response = await updateUserMbti(mbti);
            return true;
        } catch (e) {
            console.log(e);
        }
    }
}