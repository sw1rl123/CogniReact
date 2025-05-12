import React from "react";
import Placeholder from './img/placeholder.png';

export default function ChatItem({
    chat,
    onClick,
    userId,
    online
}) {

    var avatar = null;

    let dmUser = chat.isDm ? (chat.members[0] == userId ? chat.members[1] : chat.members[0]) : null;

    var chatName = (
        <div className="truncate chatname" id={`chat_name_${chat.id}`}>
            {dmUser == null ? chat.name : dmUser}
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
    var _ = (
        <div className="chat-item-container flex flex-col">
            <div id={`chat_${chat.id}`} className="chat-item flex flex-col overflow-hidden" onClick={() => onClick(chat.id)}>
                <div style={{display:"flex", justifyContent: "space-between"}}>{chatName} {time}</div>
                <div style={{display:"flex", justifyContent: "space-between"}}>{last_msg} {unreaden_count}</div>
            </div>
        </div>
    );
    return (
        <li className="messages__item message" onClick={(e) => onClick(chat.id)}>
            <img className="message__img" src={avatar ? avatar : Placeholder}></img>
            <div className="message__info">
                <div className="message__header">
                    <h3 className="message__title">{chatName}</h3>
                    <span className="message__time">{dateTimeStr}</span>
                </div>
                <div className="message__text">
                    {last_msg}
                    {userId == chat.lastMessage.senderId && unreaden_count}
                </div>
            </div>
        </li>
    );
}
