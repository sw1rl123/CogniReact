import React, { useContext, useEffect, useRef, useState } from 'react';
import "./style.css"
import MessageList from './MessageList';
import * as signalR from "@microsoft/signalr";
import { showToast } from '../../services/globals';
import ChatItem from './ChatItem';



class ChatObject {
    constructor({ id = null, name = null, isDm = null, members = null, lastMessage = null, ownerId = null, unreadCount = null } = {}) {
        this.id = id;
        this.name = name;
        this.isDm = isDm;
        this.members = members;
        this.lastMessage = lastMessage;
        this.ownerId = ownerId;
        this.unreadCount = unreadCount;
    }
}

export default function Chats({connection, msg}) {
    const token = localStorage.getItem('aToken');
    const [chats, setChats] = useState([]);

    const [chatOpen, setChatOpen] = useState(null);

    useEffect(() => {
        console.log(`Chats useEffect ${msg}`);
        if (connection == null) {
            console.error("Connection not found");
            return;
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
            const c = new ChatObject({
                name: chat.name,
                id: chat.id,
                isDm: chat.isDm,
                members: chat.members,
                lastMessage: chat.lastMessage,
                ownerId: chat.ownerId,
                unreadCount: chat.unreadCount
            });
            await addChat(c);
        }
    });

    const addChat = async (chatObject) => {
        console.log("Chats:", chats);
        setChats(prevChats => [...prevChats, chatObject]);
        console.log("Chats:", chats);
    }

    const currentUserId = localStorage.getItem('userId');

    const openChat = (chatId) => {
        const chat = chats.find(chat => chat.id === chatId);
        if (chat) {
            
        }
    }



    const closeChat = () => {

    }
     
    //style={chatOpen != null ? {display: "hidden"} : {display: "block"}}
    return (
        <div id="chats">
            <button onClick={() => connection.invoke("createGroup", "test", [currentUserId])}>Create Chat</button>
            <div id="chats_container" >
                {chats.map((chat, index) => (
                    <ChatItem key={chat.id} id={chat.id} chat={chat} connection={connection} />
                ))}
            </div>
            {chatOpen == null && <MessageList connection={connection}/>}
        </div>
    );
}
