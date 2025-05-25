import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Chats.css"
import MessageList from './MessageList';
import * as signalR from "@microsoft/signalr";
import { showToast, COGNI_API_URL, CHAT_API_URL } from '../../services/globals';
import ChatList from './ChatList';
import { useSearchParams } from 'react-router-dom';
import { Context } from '../..';

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

class MessageObject {
    constructor({ messageId = null, chatId = null, senderId = null, msg = null, date = null, isEdited = null, isFunctional = null, attachments = [], messageStatuses = [] } = {}) {
        this.messageId = messageId;
        this.chatId = chatId;
        this.senderId = senderId;
        this.msg = msg;
        this.date = date;
        this.isEdited = isEdited;
        this.isFunctional = isFunctional;
        this.attachments = attachments;
        this.messageStatuses = messageStatuses;
    }
}

export default function Chats() {
    const userId = localStorage.getItem('userId');
    const [currentToken, setCurrentToken] = useState(localStorage.getItem('aToken'));
    const [chats, setChats] = useState({});
    const [idToUsername, setIdToUsername] = useState({});
    const [dms, setDms] = useState({});
    const [chatsFetched, setChatsFetched] = useState(false);
    const [searchParams] = useSearchParams();
    const [chatOpen, setChatOpen] = useState(searchParams.get("dm"));
    const [chatMsgs, setChatMsgs] = useState({});
    const [startDmOnMessage, setStartDmOnMessage] = useState(null);
    const [connection, setConnection] = useState(null);
    const connectionRef = useRef(null);

    const {store} = useContext(Context);

    useEffect(() => {

        const userId = localStorage.getItem('userId');

        const fetchUserImage = async () => {
        try {
            const userInfo = await store.userInfo(userId);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
        };

    fetchUserImage();

        setTimeout(() => {
            setCurrentToken(localStorage.getItem('aToken'));
        }, 500);
    }, []);

    // Функция для установки соединения SignalR
    const setupSignalRConnection = async () => {
        if (!currentToken) {
            console.error("No token for SignalR connection!");
            return;
        }

        try {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${CHAT_API_URL}/chat/hub?token=${currentToken}`)
                .withAutomaticReconnect()
                .build();

            newConnection.onclose(() => {
                console.log("SignalR connection closed");
            });

            await newConnection.start();
            console.log("SignalR connection established");
            
            setConnection(newConnection);
            connectionRef.current = newConnection;
            return newConnection;
        } catch (err) {
            console.error("Error establishing SignalR connection:", err);
            showToast("Failed to connect to chat service");
            return null;
        }
    };

    const getMsgs = (chatId, startId, toNew, amount) => {
        console.log("Requesting messages...", chatId, startId, toNew, amount);
        if (connectionRef.current) {
            connectionRef.current.invoke("getMsgs", chatId, startId, toNew, amount);
        }
    };

    const openChat = (chatId) => {
        setChatOpen(chatId);
        setChatMsgs({});
        getMsgs(chatId, -1, false, 30);
    };

    const tryOpenDm = (userId) => {
        let id = dms[userId] ?? userId;
        openChat(id);
    };

    const closeChat = () => {
        setChatOpen(null);
    };

    const sendDeleteChat = (chatId) => {
        if (connectionRef.current) {
            connectionRef.current.invoke("deleteChat", chatId);
        }
    };

    const fetchUsers = async (user_ids) => {
        const response = await fetch(`${COGNI_API_URL}/user/GetUsersByIds`, {
            method: "POST",
            body: JSON.stringify(user_ids),
            headers: {
                "Content-Type": "application/json"
            }
        });
    
        if (response.ok) {
            const users = await response.json();
            for (const user of users) {
                setIdToUsername(prev => ({
                    ...prev,
                    [user.id]: `${user.name} ${user.surname}`
                }));
            }
            return users;
        } else {
            showToast("Failed to fetch users.");
            return null;
        }
    };

    const getUsername = async (userid) => {
        let username = idToUsername[userid];
        if (username == null) {
            let response = await fetchUsers([userid]);
            if (response != null) {
                for (const user of response) {
                    if (user.id == userid) {
                        return `${user.name} ${user.surname}`;
                    }
                }
            }
            username = idToUsername[userid];
            if (username == null) {
                console.log("Can't find username");
                username = "Unknown";
            }
        }
        return username;
    };

    // Эффект для управления подключением SignalR
    useEffect(() => {
        let isMounted = true;

        const initConnection = async () => {
            const conn = await setupSignalRConnection();
            if (isMounted && conn) {
                setupChatHandlers(conn);
                fetchChats(conn);
            }
        };

        initConnection();

        return () => {
            isMounted = false;
            if (connectionRef.current) {
                connectionRef.current.off("ChatList");
                connectionRef.current.off("NewChatAdded");
                connectionRef.current.off("ChatRemoved");
                connectionRef.current.off("Msgs");
                connectionRef.current.off("NewMsg");
                connectionRef.current.stop();
            }
        };
    }, [currentToken]);

    const setupChatHandlers = (conn) => {
        // Обработчик списка чатов
        conn.on("ChatList", (notification) => {
            const updatedChats = {};
            const updatedDms = {};
            
            notification.forEach(chat => {
                const c = new ChatObject(chat);
                updatedChats[c.id] = c;
                if (c.isDm && c.members?.length >= 2) {
                    const otherUserId = c.members[0] === userId ? c.members[1] : c.members[0];
                    updatedDms[otherUserId] = c.id;
                }
            });
            
            setDms(updatedDms);
            setChats(updatedChats);
            setChatsFetched(true);
        });

        conn.on("NewChatAdded", (notification) => {
            const chat = new ChatObject({
                name: notification.name,
                id: notification.chatId,
                isDm: notification.isDm,
                members: notification.members,
                lastMessage: notification.lastMessage,
                unreadCount: notification.unreadCount
            });
            
            setChats(prev => ({...prev, [chat.id]: chat}));
            
            if (chat.isDm && chat.members?.length >= 2) {
                const otherUserId = chat.members[0] === userId ? chat.members[1] : chat.members[0];
                setDms(prev => ({...prev, [otherUserId]: chat.id}));
                if (chatOpen === otherUserId) {
                    openChat(chat.id);
                }
            }
        });

        conn.on("ChatRemoved", (notification) => {
            console.log("Chat removed:", notification.chatId);
            setChats(prevChats => {
                const updatedChats = {...prevChats};
                delete updatedChats[notification.chatId];
                return updatedChats;
            });
        });

        conn.on("Msgs", (msgs) => {
            console.log("Messages received:", msgs);
            if (msgs.length == 0 && (searchParams.get("dm") == chatOpen || searchParams.get("dm") == dms[userId]) && chatOpen != null) {
                setStartDmOnMessage(true);
                console.log("Will open new DM");
            } else {
                setStartDmOnMessage(false);
                console.log("Will not open new DM");
            }
            
            msgs.forEach(msg => {
                setChatMsgs(prevChatMsgs => ({
                    ...prevChatMsgs,
                    [msg.messageId]: new MessageObject(msg)
                }));
            });
        });

        conn.on("NewMsg", (msg) => {
            setChatMsgs(prevChatMsgs => ({
                ...prevChatMsgs,
                [msg.messageId]: new MessageObject(msg)
            }));
        });
    };

    const fetchChats = async (conn) => {
        try {
            await conn.invoke("GetChatList");
        } catch (error) {
            console.error("Error fetching chats:", error);
            showToast("Failed to load chats");
        }
    };

    useEffect(() => {
        if (chatOpen != null) {
            tryOpenDm(chatOpen);
        }
    }, [chatsFetched]);

    if (!currentToken) {
        console.error("Token not found in localStorage");
        showToast("Token not found in localStorage");
        return null;
    }

    if (!connection) {
        return <div></div>;
    }

    return (
        <div className="messages">
            <ChatList 
                getUsername={getUsername} 
                chats={chats} 
                userId={userId} 
                shown={chatOpen == null} 
                onClick={openChat}
            />
            {chatOpen == null ||
                <MessageList 
                    getUsername={getUsername} 
                    userId={userId} 
                    chatObject={chats[chatOpen]} 
                    chatId={chatOpen} 
                    onClose={closeChat} 
                    connectionRef={connectionRef} 
                    chatMsgs={chatMsgs} 
                    startDmOnMessage={startDmOnMessage}
                />
            }
        </div>
    );
}