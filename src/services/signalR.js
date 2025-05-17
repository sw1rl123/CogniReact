import * as signalR from "@microsoft/signalr";
import { CHAT_API_URL, showToast } from "./globals.js";

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
        .withUrl(`${CHAT_API_URL}/chat/hub?token=${token}`)
        .build();

    connection.onclose(() => {
        console.warn("SignalR Disconnected.");
        showToast("SignalR Disconnected.");
    });

    await connection.start().then(() => {
        // getChatList(); // is it important?
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
