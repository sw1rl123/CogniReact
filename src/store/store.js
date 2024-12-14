import { createUser, loginUser } from "../services/auth.js";
import { getUserById, getUserPosts, getUserFriends, getUserFriendsAmount, createPost } from "../services/userProfile.js";

export default class Store {

    async register(user) {
        try {
            const response = await createUser(user);
            localStorage.setItem('aToken', response.data.aToken);
            localStorage.setItem('rToken', response.data.rToken);
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
                localStorage.setItem('aToken', response.data.aToken);
                localStorage.setItem('rToken', response.data.rToken);
                localStorage.setItem('userId', response.data.id);
                return true;
            }
        } catch (e) {
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
}