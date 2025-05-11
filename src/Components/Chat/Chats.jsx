import React, { useContext, useEffect, useRef, useState } from 'react';
import "./style.css"
import ChatList from './ChatList';
import MessageList from './MessageList';
import * as signalR from "@microsoft/signalr";
import { showToast } from '../../services/globals';



class ChatObject {
    id = null;
    name = null;
    isDm = null;
    members = null;
    lastMessage = null;
    unreadCount = null;
    constructor(id, name, isDm, members, lastMessage, unreadCount) {
        this.id = id;
        this.name = name;
        this.isDm = isDm;
        this.members = members;
        this.lastMessage = lastMessage;
        this.unreadCount = unreadCount;
    }
}

export default function Chats({connection, msg}) {
    const token = localStorage.getItem('aToken');
    const [chats, setChats] = useState([]);

    useEffect(() => {
        console.log(`Chats useEffect ${msg}`);
        if (connection == null) {
            console.error("Connection not found");
        }
        const fetchChats = async () => {
            try {
                await connection.invoke("GetChatList");
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChats();
    });

    if (!token) {
        console.error("Token not found in localStorage");
        showToast("Token not found in localStorage");
        return <></>;
    }
    if (connection == null) {
        console.error("Connection not found");
        showToast("Connection not found");
        return <></>;
    }
    console.log(connection)

    connection.on("ChatList", async function (notification) {
        for (const chat of notification) {
            console.log(chat)
            await addChat(
                ChatObject(
                    chat.name, 
                    chat.id, 
                    chat.isDm, 
                    chat.members,
                    chat.lastMessage, 
                    chat.unreadCount
                )
            );
        }
    });

    const addChat = async (chatObject) => {
        setChats(prevChats => [...prevChats, chatObject]);
    }

    const currentUserId = localStorage.getItem('userId');

    const openChat = (chatId) => {
        const chat = chats.find(chat => chat.id === chatId);
        if (chat) {
            
        }
    }
     

    return (
        <div id="chats">
            <button onClick={() => connection.invoke("CreateChat", currentUserId, "test")}>Create Chat</button>
            <ChatList connection={connection} chats={chats} />
            <MessageList connection={connection} />
        </div>
    );
}
