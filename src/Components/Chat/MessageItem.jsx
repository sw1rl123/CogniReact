import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatItem from './ChatItem';
import "./Messages.css"

export default function MessageItem({userId, messageObject}) {


    //             
    //                 <span className="chat__date">11 мая</span>
    //                 <p className="chat__message">Привет завтра во сколько встречаемся?<span className="chat__time">18:35</span></p>
    //                 {isSended && <p className="chat__message chat__message--own">Привет, думаю к 10<span className="chat__time">18:41</span></p>}
    //             </div>

            //<p className="chat__message chat__message--own">Привет, думаю к 10<span className="chat__time">18:41</span></p>
//
    const date = new Date(messageObject.date);
    const dateTimeStr = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });

    return (
        messageObject.isFunctional ? <span className="chat__date">{messageObject.msg}</span> :
        <p className={messageObject.senderId != userId ? "chat__message" : "chat__message chat__message--own"}>{messageObject.msg}
        <span className="chat__time">{dateTimeStr}</span></p>
    );
}
