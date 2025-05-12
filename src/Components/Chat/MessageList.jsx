import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatItem from './ChatItem';
import "./Messages.css"
import MessageItem from './MessageItem';

export default function MessageList({chatId, chatObject, userId, onClose, chatMsgs, connection, avatar, Placeholder, startDmOnMessage}) {
    const [inputText, setInputText] = useState("");
    const [ext, setExt] = useState([]);

    
    const sendMSG = async () => {
        if (startDmOnMessage == null) {
            // todo: notify that chat is loading
            console.log("Chat is loading, please wait");
            return;
        }
        const message = inputText.trim();
        console.log("sendMSG", message);
        setInputText("");
        if (message != "" || (ext != null && ext.length > 0)) {
            // scrollToBottom();
            // connection.invoke("readMessages", chatId, -1);
            if (startDmOnMessage) {
                connection.invoke("startDm", chatId, message);
            } else {
                connection.invoke("sendMsg", chatId, message, ext)
            }
        }
    }
    let dmUser = chatObject == null ? chatId : chatObject.isDm ? (chatObject.members[0] == userId ? chatObject.members[1] : chatObject.members[0]) : null;
    return (
        <>
        <button onClick={() => onClose()}>Close chat</button>
        <section className="messages__chats" id="messages">
            <div className="chat__header">
                <div className="chat__icon" onClick={(e) => onClose()}/>
                     <img className="chat__img" src={avatar ? avatar : Placeholder}></img>
                     <div className="chat__info">
                         <h2 className="chat__name">{dmUser == null ? chatId : dmUser}</h2>
                         <span className="chat__status">не в сети</span>
                     </div>
                     <span className="chat__type">ISFP</span>
            </div>
            <div className="chat__dialog">
                {Object.entries(chatMsgs).map(([id, msg]) => (
                        <MessageItem key={id} messageObject={msg} userId={userId}/>
                ))}
            </div>
            <div className='chat__write'>
                     <input className="chat__input" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Сообщение"></input>
                     <div onClick={(e) => sendMSG()} style={{width: "32px", height: "32px", background: "yellow"}}/>
                 </div>
        </section>
        </>
    );
}
