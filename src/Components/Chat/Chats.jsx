import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Chats.css"
import MessageList from './MessageList';
import * as signalR from "@microsoft/signalr";
import { showToast, COGNI_API_URL } from '../../services/globals';
import ChatItem from './ChatItem';
import ChatList from './ChatList';
import { useLocation, useSearchParams } from 'react-router-dom';
import { set } from 'mobx';



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

export default function Chats({connectionRef, msg}) {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('aToken');
    const [chats, setChats] = useState({});
    const [idToUsername, setIdToUsername] = useState({});

    const [dms, setDms] = useState({});
    const chatsRef = useRef(chats);
    const [chatsFetched, setChatsFetched] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const [chatOpen, setChatOpen] = useState(searchParams.get("dm"));
    const [chatMsgs, setChatMsgs] = useState({});

    const [startDmOnMessage, setStartDmOnMessage] = useState(null);


    useEffect(() => {
        chatsRef.current = chats;
    }, [chats]);

    const getMsgs = (chatId, startId, toNew, amount) => {
        console.log("Requesting messages...", chatId, startId, toNew, amount)
        connectionRef.current.invoke("getMsgs", chatId, startId, toNew, amount);
    }

    const openChat = (chatId) => {
        setChatOpen(chatId);
        setChatMsgs({});
        getMsgs(chatId, -1, false, 30);
    }

    const tryOpenDm = (userId) => {
        let id = dms[userId] ?? userId;
        openChat(id);
    }


    useEffect(() => {
        const fetchChats = async () => {
            try {
                await connectionRef.current.invoke("GetChatList");
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        console.log("Fetching chats...");

        fetchChats();

        const handleChatList = (notification) => {
            const updatedChats = {};
            const updatedDms = {};
            console.log("Chat list updated:", notification);
            for (const chat of notification) {
                const c = new ChatObject(chat);
                updatedChats[c.id] = c;
                if (c.isDm) {
                    let otherUserId = c.members[0] == userId ? c.members[1] : c.members[0];
                    updatedDms[otherUserId] = c.id
                }
            }
            setDms(updatedDms);
            setChats(updatedChats);
            setChatsFetched(true)
        };

        connectionRef.current.off("ChatList");
        connectionRef.current.on("ChatList", handleChatList);

        const addChat = (chatObject) => {
            setChats(prevChats => ({...prevChats, [chatObject.id]: chatObject}));
            if (chatObject.isDm) {
                let otherUserId = chatObject.members[0] == userId ? chatObject.members[1] : chatObject.members[0];
                let newChatId = chatObject.id;
                setDms(prevDms => ({...prevDms, [otherUserId]: newChatId}))
                if (chatOpen == otherUserId) {
                    openChat(newChatId)
                }
            }

        }

        connectionRef.current.off("NewChatAdded");
        connectionRef.current.on("NewChatAdded", (notification) => {
            console.log("New chat added:", notification);
            addChat(new ChatObject({
                name: notification.name,
                id: notification.chatId,
                isDm: notification.isDm,
                members: notification.members,
                lastMessage: notification.lastMessage,
                unreadCount: notification.unreadCount
            }))
        });

        connectionRef.current.off("ChatRemoved");
        connectionRef.current.on("ChatRemoved", (notification) => {
            console.log("Chat removed:", notification.chatId);
            setChats(prevChats => {
                const updatedChats = {...prevChats};
                delete updatedChats[notification.chatId];
                return updatedChats;
            });
        });

        connectionRef.current.off("Msgs");
        connectionRef.current.on("Msgs", (msgs) => {
            console.log("Messages received:", msgs);
            if (msgs.length == 0 && (searchParams.get("dm") == chatOpen || searchParams.get("dm") ==  dms[userId]) && chatOpen != null) {
                setStartDmOnMessage(true);
                console.log("Will open new DM");
            } else {
                setStartDmOnMessage(false);
                console.log("Will not open new DM");
            }
            searchParams.delete("dm")
            msgs.map(msg => (
                setChatMsgs(prevChatMsgs => ({
                    ...prevChatMsgs,
                    [msg.messageId]: new MessageObject(msg)
                })))
            );
        });

        connectionRef.current.off("NewMsg");
        connectionRef.current.on("NewMsg", (msg) => {
            setChatMsgs(prevChatMsgs => ({
                ...prevChatMsgs,
                [msg.messageId]: new MessageObject(msg)
            }));
        })

        if (chatOpen != null) {
            tryOpenDm(chatOpen);
        }

        return () => {
            connectionRef.current.off("ChatList");
            connectionRef.current.off("NewChatAdded");
            connectionRef.current.off("ChatRemoved");
            connectionRef.current.off("Msgs");
            connectionRef.current.off("NewMsg");
        };
    }, [connectionRef]);
    
    useEffect(() => {
        if (chatOpen != null) {
            tryOpenDm(chatOpen);
        }
    }, [chatsFetched])

    if (!token) {
        console.error("Token not found in localStorage");
        showToast("Token not found in localStorage");
        return <></>;
    }

    if (connectionRef.current == null) {
        console.error("Connection not found");
        showToast("Connection not found");
        return <></>;
    }



    const closeChat = () => {
        setChatOpen(null);
    }

    const sendDeleteChat = (chatId) => {
        connectionRef.current.invoke("deleteChat", chatId);
    }

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
            console.log("Getted", users)
            for (const user of users) {
                setIdToUsername(prev => ({
                    ...prev,
                    [user.id]: `${user.name} ${user.surname}`
                }))
            }
            return users
        } else {
            showToast("Failed to fetch users.");
        }
    }

    const getUsername = async (userid) => {
        console.log("Requesting", userid)
        let username = idToUsername[userid];
        if (username == null) {
            let response = await fetchUsers([userid]);
            if (response != null) {
                for (const user of response) {
                    if (user.id == userid) {
                        return `${user.name} ${user.surname}`
                    }
                }
            }
            username = idToUsername[userid];
            if (username == null) {
                console.log("Can't find username");
                username = "Unknown";
            }
        }
        return username
    }

    return (
        <div className="messages">
            {/* <button onClick={() => connectionRef.invoke("createGroup", "Cogni🤝", ["26", "27"])}>Create Chat</button> */}
            <ChatList getUsername={getUsername} chats={chats} userId={userId} shown={chatOpen == null} onClick={openChat}/>
            {chatOpen == null || <MessageList getUsername={getUsername} userId={userId} chatObject={chats[chatOpen]} chatId={chatOpen} onClose={closeChat} connectionRef={connectionRef} chatMsgs={chatMsgs} startDmOnMessage={startDmOnMessage}/> }
        </div>
    );
}
