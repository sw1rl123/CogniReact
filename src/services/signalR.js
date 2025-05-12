import * as signalR from "@microsoft/signalr";
// import { addChat, addMessages, addSentMessage, clearUserChats, removeChat, handleNewMessage, user_to_dm, updateOnlineUsers, chats, UpdateChatTyping, setUnreadenCounter, RenameGroupChat, deleteMessageHandler, editMessageHandler } from "./chats.js";
import { apiBase, logout, showToast } from "./globals.js";

let connection = null;

export async function startSignalRConnection(token) {
    if (connection) {
        console.warn("SignalR connection already exists. Closing existing connection...");
        await stopSignalRConnection();
    }
    if (connection != null) {
        await connection.stop();
        connection = null;
    } 
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${apiBase}/chat/hub?token=${token}`)
        .build();

    connection.onclose(() => {
        console.warn("SignalR Disconnected.");
        showToast("SignalR Disconnected.");
        // clearUserChats();
        imHereDaemon.stop();
        fetchDmsDaemon.stop();
    });

    await connection.start().then(() => {
        imHereDaemon.start();
        fetchDmsDaemon.start();
        getChatList();
    });

    console.log("SignalR Connected");
    return connection;
}

export async function stopSignalRConnection() {
    if (connection) {
        await connection.stop();
        console.log("Disconnected from SignalR");
        connection = null;
    }
}

// signalR isnt case-sensitive, u can use any of this: GetMsgs/getmsgs/getMsgs/GeTmSgS

export function imHere() {
    connection.invoke("imHere");
}

export function createGroup(group, users) {
    connection.invoke("createGroup", group, users);
}

export function getMsgs(chatId, startId, toNew, amount) {
    connection.invoke("getMsgs", chatId, startId, toNew, amount);
}

export function startDm(user_id, msg) {
    connection.invoke("startDm", user_id, msg);
}

export function sendMsg(chatId, msg, ext=null) {
    connection.invoke("sendMsg", chatId, msg, ext);
}

export function getChatList() {
    connection.invoke("getChatList");
}

export function deleteChat(chatId) {
    connection.invoke("deleteChat", chatId);
}

export function leaveGroup(chatId) {
    connection.invoke("leaveGroup", chatId);
}

export function addToGroup(chatId, userId) {
    connection.invoke("addToGroup", chatId, userId);
}

export function getUsersOnline(userIds) {
    connection.invoke("getUsersOnline", userIds);
}
export function getChatsTyping(chatIds) {
    connection.invoke("getChatsTyping", chatIds);
}

export function readMessages(chatId, lastMsgId) {
    connection.invoke("readMessages", chatId, lastMsgId);
}

export function renameGroup(chatId, newName) {
    connection.invoke("renameGroup", chatId, newName);
}

export function typing(chatId) {
    if (connection == null) return;
    console.log("Im typing ", chatId)
    connection.invoke("typing", chatId);
}

export function editMessage(messageId, newMessage) {
    connection.invoke("editMessage", messageId, newMessage);
}

export function deleteMessage(messageId) {
    console.log("Deleting ", messageId)
    connection.invoke("deleteMessage", messageId);
}

class ImHereDaemon {
    constructor(interval = 1000) {
        this.interval = interval;
        this.running = false;
        this.loop();
    }
    start() {
        this.running = true;
    }
    stop() {
        this.running = false;
    }

    loop() {
        if (this.running){
            imHere();
        }
        setTimeout(() => this.loop(), this.interval);
    }
}

var imHereDaemon = new ImHereDaemon(1000);

class FetchDmsDaeman {
    constructor(interval = 1000) {
        this.interval = interval;
        this.running = false;
        this.loop();
    }
    start() {
        this.running = true;
    }
    stop() {
        this.running = false;
    }

    loop() {
        if (this.running){
            // getUsersOnline(Object.keys(user_to_dm));
            // getChatsTyping(Array.from(chats))
        }
        setTimeout(() => this.loop(), this.interval);
    }
}
var fetchDmsDaemon = new FetchDmsDaeman(1000);


