import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Messages.css"
import MessageItem from './MessageItem';
import { ReactComponent as SubmitIcon } from './img/submit.svg';
import { ReactComponent as ArrowIcon } from './img/arrow.svg';
import Placeholder from "./img/placeholder.png";
import { Context } from "../..";

export default function MessageList({chatId, chatObject, userId, onClose, chatMsgs, connection, startDmOnMessage}) {
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
            connection.invoke("readMessages", chatId, -1);
            if (startDmOnMessage) {
                connection.invoke("startDm", chatId, message);
            } else {
                connection.invoke("sendMsg", chatId, message, ext)
            }
        }
    }
    let dmUser = chatObject == null ? chatId : chatObject.isDm ? (chatObject.members[0] == userId ? chatObject.members[1] : chatObject.members[0]) : null;

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
        {/* <button onClick={() => onClose()}>Close chat</button> */}
        <section className="messages__chat" id="messages">
            <div className="chat__header">
                <ArrowIcon className="chat__icon" onClick={(e) => onClose()}/>
                     <img className="chat__img" src={usersAvatars.get(dmUser.toString()) ? usersAvatars.get(dmUser.toString()) : Placeholder}></img>
                     <div className="chat__info">
                         <h2 className="chat__name">{dmUser == null ? chatId : usersNames.get(dmUser.toString())}</h2>
                         <span className="chat__status">не в сети</span>
                     </div>
                     <span className="chat__type">ISFP</span>
            </div>
            <div className="chat__dialog">
                {Object.entries(chatMsgs).toReversed().map(([id, msg]) => (
                        <MessageItem key={id} messageObject={msg} userId={userId}/>
                ))}
            </div>
            <div className='chat__write'>
                     <input className="chat__input" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Сообщение"></input>
                     <SubmitIcon onClick={(e) => sendMSG()}/>
                 </div>
        </section>
        </>
    );
}
