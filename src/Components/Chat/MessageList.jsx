import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Messages.css"
import MessageItem from './MessageItem';

import { COGNI_API_URL, showToast } from '../../services/globals';

import { ReactComponent as SubmitIcon } from './img/submit.svg';
import { ReactComponent as ArrowIcon } from './img/arrow.svg';
import Placeholder from "./img/placeholder.png";
import { Context } from "../..";

// chatId is very important! We cant get it from chatObject due query param
export default function MessageList({chatId, getUsername, chatObject, userId, onClose, chatMsgs, connection, startDmOnMessage}) {
    const [inputText, setInputText] = useState("");
    const [ext, setExt] = useState([]);

    
    const sendMessage = async (ext=null) => {
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

    const [chatName, setChatName] = useState(null);

    useEffect(() => {
        const fetchChatName = async () => {
            let dmUser = chatObject == null ? chatId : chatObject.isDm ? (chatObject.members[0] == userId ? chatObject.members[1] : chatObject.members[0]) : null;
            console.log("dmUser", dmUser)
            if (dmUser) {
                const name = await getUsername(dmUser);
                setChatName(name);
            } else {
                setChatName(chatObject.name);
            }
        };

        fetchChatName();
    }, [chatObject, userId, getUsername]);


    
    const sendFiles = (e, as_media=false) => {
        const files = e.target.files;
        if (files.length > 9) {
            showToast("You can select up to 9 files only.");
            return null;
        }
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 1 * 1024 * 1024 * 1024) {
                showToast(`File ${files[i].name} is too large. Max file size is 1GB.`);
                return null;
            }
        }
        uploadFiles(files, as_media);
    }
    const uploadFiles = async (files, as_media=false) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        try {
            const response = await fetch(`${COGNI_API_URL}/chat/files/upload`, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                throw new Error("Upload failed");
            }
            const data = await response.json();
            console.log("Files uploaded successfully:", data);
            var links = data.links
            if (!as_media) {links = data.links.map(l => "FILE::" + l);}
            sendMessage(links);
        } catch (error) {
            showToast("Error uploading files: " + error.message);
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
                         <h2 className="chat__name">{chatName}</h2>
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
                <SubmitIcon onClick={(e) => sendMessage()} style={{width: "32px", height: "32px"}}/>
                <SubmitIcon onClick={(e) => {document.getElementById("media-input").click()}} style={{width: "32px", height: "32px", rotate: "45deg"}}/>
                {/* <SubmitIcon onClick={(e) => {document.getElementById("files-input").click()}} style={{width: "32px", height: "32px"}}/> */}
            </div>
            <input type="file" id="files-input" multiple style={{display: "none"}} onChange={(e) => sendFiles(e, false)}/>
            <input type="file" id="media-input" multiple style={{display: "none"}} onChange={(e) => sendFiles(e, true)}/>
        </section>
        </>
    );
}


export function getFileExtension(filename) {
    const match = filename.match(/\.([^.]+)$/);
    return match ? match[1] : "txt";
}

export function removeUUID(filename) {
    return filename.replace(/^[a-f0-9-]+_/, '');
}

export function getFilename(filepath) {
    return filepath.split('/').pop();
}
