    import React, { useContext, useEffect, useRef, useState } from 'react';
    import "./Chats.css"
    import MessageList from './MessageList';
    import * as signalR from "@microsoft/signalr";
    import { showToast } from '../../services/globals';
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
        constructor({ messageId = null, chatId = null, senderId = null, msg = null, date = null, isEdited = null, isFunctional = null, attachments = null, messageStatuses = [] } = {}) {
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

    export default function Chats({connection, msg}) {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('aToken');
        const [chats, setChats] = useState({});


        const chatsRef = useRef(chats);

        const [searchParams, setSearchParams] = useSearchParams();

        const [chatOpen, setChatOpen] = useState(searchParams.get("dm"));
        const [chatMsgs, setChatMsgs] = useState({});

        const [startDmOnMessage, setStartDmOnMessage] = useState(null);
        
        useEffect(() => {
            chatsRef.current = chats;
        }, [chats]);

        useEffect(() => {
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
            console.log("Fetching chats...");
            fetchChats();
            const handleChatList = (notification) => {
                const updatedChats = {};
                console.log("Chat list updated:", notification);
                for (const chat of notification) {
                    const c = new ChatObject(chat);
                    updatedChats[c.id] = c;
                }
                setChats(updatedChats);
            };

            connection.off("ChatList");
            connection.on("ChatList", handleChatList);

            const addChat = (chatObject) => {
                setChats(prevChats => ({...prevChats, [chatObject.id]: chatObject}));
            }

            connection.off("NewChatAdded");
            connection.on("NewChatAdded", (notification) => {
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

            connection.off("ChatRemoved");
            connection.on("ChatRemoved", (notification) => {
                console.log("Chat removed:", notification.chatId);
                setChats(prevChats => {
                    const updatedChats = {...prevChats};
                    delete updatedChats[notification.chatId];
                    return updatedChats;
                });
            });

            connection.off("Msgs");
            connection.on("Msgs", (msgs) => {
                console.log("Messages received:", msgs);
                if (msgs.length == 0 && searchParams.get("dm") == chatOpen && chatOpen != null) {
                    setStartDmOnMessage(true);
                    console.log("Will open new DM");
                } else {
                    setStartDmOnMessage(false);
                    console.log("Will not open new DM");
                }
                msgs.map(msg => (
                    setChatMsgs(prevChatMsgs => ({
                        ...prevChatMsgs,
                        [msg.messageId]: new MessageObject(msg)
                    })))
                );
            });

            if (chatOpen != null) {
                openChat(chatOpen);
            }

            connection.off("NewMsg");
            connection.on("NewMsg", (msg) => {
                setChatMsgs(prevChatMsgs => ({
                    ...prevChatMsgs,
                    [msg.messageId]: new MessageObject(msg)
                }));
            })

            return () => {
                connection.off("ChatList");
                connection.off("NewChatAdded");
                connection.off("ChatRemoved");
                connection.off("Msgs");
                connection.off("NewMsg");
            };
        }, [connection]);
        

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

        const currentUserId = localStorage.getItem('userId');

        const getMsgs = (chatId, startId, toNew, amount) => {
            connection.invoke("getMsgs", chatId, startId, toNew, amount);
        }


        const openChat = (chatId) => {
            setChatOpen(chatId);
            setChatMsgs({});
            getMsgs(chatId, -1, false, 30);
        }


        const closeChat = () => {
            setChatOpen(null);
        }

        const sendDeleteChat = (chatId) => {
            connection.invoke("deleteChat", chatId);
        }

        return (
            <div className="messages">
                {/* <button onClick={() => connection.invoke("createGroup", "Cogni🤝", ["1", "27"])}>Create Chat</button> */}
                <ChatList chats={chats} userId={userId} shown={chatOpen == null} onClick={openChat}/>
                {chatOpen == null || <MessageList userId={userId} chatObject={chats[chatOpen]} chatId={chatOpen} onClose={closeChat} connection={connection} chatMsgs={chatMsgs} startDmOnMessage={startDmOnMessage}/> }
            </div>
        );
    }
