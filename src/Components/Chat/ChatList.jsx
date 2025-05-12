import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatItem from './ChatItem';


export default function ChatList({chats, userId, shown, onClick, avatar, Placeholder, isSended}) {
    return (
        <>

            <section className="messages__header" style={{display: shown ? "block" : "none"}}>
                <h2 className="messages__heading">Чаты</h2>
            </section>
            <section className="messages__chats" style={{display: shown ? "block" : "none"}}>
                <ul className="messages__list">
                    {Object.entries(chats).map(([id, chat]) => (
                        <ChatItem key={id} userId={userId} id={id} chat={chat} onClick={() => onClick(id)}/>
                    ))}
                </ul>
            </section>
        </>
        // <div id="chats_container" className="messages__chats" >
        //     {Object.entries(chats).map(([id, chat]) => (
        //         
        //     ))}
        // </div>
    );
}
