import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatItem from './ChatItem';
import { Context } from "../..";



export default function ChatList({chats, userId, shown, onClick}) {

    const [usersNames, setUsersNames] = useState(null);
    const [usersAvatars, setUsersAvatars] = useState(null);
    const {store} = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
            const users = await store.getAllUsers();
            var idToName = new Map();
            var idToPicture = new Map();
            for (let i = 0; i < users.length; i++) {
                idToName.set(users[i].id.toString(), users[i].name + " " + users[i].surname);
                idToPicture.set(users[i].id.toString(), users[i].picUrl);
            }
            setUsersNames(idToName);
            setUsersAvatars(idToPicture);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
    
        }
        fetchUsers();
        }, []);

        if (isLoading) {
            return <></>;
        }
    return (
        <>
            <section className="messages__header" style={{display: shown ? "block" : "none"}}>
                <h2 className="messages__heading">Чаты</h2>
            </section>
            <section className="messages__chats" style={{display: shown ? "block" : "none"}}>
                <ul className="messages__list">
                    {Object.entries(chats).map(([id, chat]) => (
                        <ChatItem  userName={usersNames.get(chat.members[1].toString())} userImage={usersAvatars.get(chat.members[1].toString())} key={id} userId={userId} id={id} chat={chat} onClick={() => onClick(id)}/>
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
