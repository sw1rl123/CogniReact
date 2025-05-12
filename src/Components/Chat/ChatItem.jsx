import React, { useContext, useEffect, useRef, useState } from 'react';
import React, { useContext, useEffect, useState } from "react";
import Placeholder from './img/placeholder.png';
import { Context } from "../..";

export default function ChatItem({
    chat,
    onClick,
    userId,
    online,
    getUsername,
    userName,
    userImage
}) {

    let dmUser = chat.isDm ? (chat.members[0] == userId ? chat.members[1] : chat.members[0]) : null;

    var chatName = (
        <div className="truncate chatname" id={`chat_name_${chat.id}`}>
            {dmUser == null ? chat.name : userName}
        </div>
    );
    var userId = localStorage.getItem("userId");
    var last_msg = chat.lastMessage.isFunctional ? (
        <div className="preview_message_style">{chat.lastMessage.msg}</div>
    ) : (
    <div className="flex-row truncate">
        <div style={{marginRight: "6px"}} className="preview_username">{userId == chat.lastMessage.senderId ? "You:" : chat.isDm ? "" : chat.lastMessage.senderId + ": "}</div>
        <div className="preview_message_style">{chat.lastMessage.msg}</div>
    </div>
   );

    const date = new Date(chat.lastMessage.date);
    const dateTimeStr = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    var time = (
        <div className="preview_message_style">
            {dateTimeStr}
        </div>
    )
    var unreaden_count = chat.unreadCount > 0 ? (
        <span className="message__count">{chat.unreadCount}</span>
    ) : (
        <></>
    );

    const [chatName, setChatName] = useState(null);
    
    useEffect(() => {
        const fetchChatName = async () => {
            if (!chat) return;

            if (chat.isDm) {
                const dmUser = chat.members[0] === userId ? chat.members[1] : chat.members[0];
                const name = await getUsername(dmUser);
                setChatName(name);
            } else {
                setChatName(chat.name);
            }
        };

        fetchChatName();
    }, [chat, userId, getUsername]);

    return (
        <li className="messages__item message" onClick={(e) => onClick(chat.id)}>
            <img className="message__img" src={userImage ? userImage : Placeholder}></img>
            <div className="message__info">
                <div className="message__header">
                    <h3 className="message__title">
                        <div className="truncate chatname" id={`chat_name_${chat.id}`}>
                            {chatName}
                        </div>
                    </h3>
                    <span className="message__time">{dateTimeStr}</span>ц
                </div>
                <div className="message__text">
                    {last_msg}
                    {userId == chat.lastMessage.senderId && <></>/*unreaden_count*/}
                </div>
            </div>
        </li>
    );
}
