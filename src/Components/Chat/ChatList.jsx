import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatItem from "./ChatItem";



export default function ChatList({connection}) {
    const [isLoading, setIsLoading] = useState(true);
    
    const token = localStorage.getItem('aToken');
    const currentUserId = localStorage.getItem('userId');

    const [chats, setChats] = useState([]);

     

    if (isLoading) 
        return <></>;
    else 
    return (
        <div id="chats_container">
            <ChatItem connection={connection} />
        </div>
    );
}
