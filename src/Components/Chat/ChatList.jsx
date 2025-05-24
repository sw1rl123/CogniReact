import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatItem from './ChatItem';
import { Context } from "../..";



export default function ChatList({chats, getUsername, userId, shown, onClick}) {

    const [usersAvatars, setUsersAvatars] = useState(null);
    const [usersMBTI, setUsersMBTI] = useState(null);
    const {store} = useContext(Context);

    let chatsTemp = Object.entries(chats);
    let chatsSortByTime = [];
    for (let i = 0; i < chatsTemp.length; i++) {
        let time = new Date(chatsTemp[i][1].lastMessage.date).getTime();
        chatsSortByTime.push([i, time])
    }

    chatsSortByTime.sort((a, b) => a[1] - b[1]);
    let chatsSorted = [];
    chatsSortByTime.forEach((element) => chatsSorted.push(chatsTemp[element[0]]));

    useEffect(() => {
        let buddyIds = [];

        for (let i = 0; i < Object.entries(chats).length; i++) {
            if (Object.entries(chats)[i][1].isDm) {
                var buddyId = Object.entries(chats)[i][1].members[0] == userId ? Object.entries(chats)[i][1].members[1] : Object.entries(chats)[i][1].members[0];
                buddyIds.push(buddyId);
            }
        }
        

        const fetchUsers = async () => {
            try {
            const users = await store.getAllUsersChats(buddyIds);
            var idToPicture = new Map();
            var idToMBTI = new Map();
            for (let i = 0; i < users.length; i++) {
                idToPicture.set(users[i].id.toString(), users[i].activeAvatar);
                idToMBTI.set(users[i].id.toString(), users[i].typeMbti);
            }
            setUsersAvatars(idToPicture);
            setUsersMBTI(idToMBTI);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
    
        }
        fetchUsers();
        }, [chats]);

        // if (isLoading) {
        //     return <></>;
        // }
    
    return (
        <>
            <section className="messages__header" style={{display: shown ? "block" : "none"}}>
                <h2 className="messages__heading">Чаты</h2>
            </section>
            <section className="messages__chats" style={{display: shown ? "block" : "none"}}>
                <ul className="messages__list">
                    {chatsSorted.reverse().map(([id, chat]) => (
                        <ChatItem getUsername={getUsername} userMbti={usersMBTI.get((chat.isDm ? (chat.members[0] == userId ? chat.members[1].toString() : chat.members[0].toString()) : null))}
                        userImage={usersAvatars.get((chat.isDm ? (chat.members[0] == userId ? chat.members[1].toString() : chat.members[0].toString()) : null))} key={id} userId={userId} id={id} chat={chat} onClick={() => onClick(id)}/>
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
