import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatItem from './ChatItem';


export default function MessageList({connection}) {
    const [isLoading, setIsLoading] = useState(false);
    
    const token = localStorage.getItem('aToken');
    const currentUserId = localStorage.getItem('userId');

    const [chats, setChats] = useState([]);

     
    
    return (
        <div id="messages_container">
        </div>
    );
}
