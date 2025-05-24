import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatItem from './ChatItem';
import "./Messages.css"
import { apiBase, MINIO_API_URL } from '../../services/globals';
import { getFileExtension } from './MessageList';

export default function MessageItem({userId, messageObject}) {
    const date = new Date(messageObject.date);
    const dateTimeStr = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    // console.log("Attachments:", messageObject.attachments)
    // console.log(messageObject.attachments != null && messageObject.attachments.map(e => `Aboba ${e}`))
    return (
        messageObject.isFunctional ? <span className="chat__message-func"><span>{messageObject.msg}</span></span> :
        <p className={messageObject.senderId != userId ? "chat__message" : "chat__message chat__message--own"}>{messageObject.msg}
        {messageObject.attachments != null && messageObject.attachments.map(link => {
            {console.log("Elem: ", link)}
            return createMediaComponent(link)
        })} 
        <span className="chat__time">{dateTimeStr}</span></p>
    );
}


function createMediaComponent(fileLink) {
    const extension = getFileExtension(fileLink);
    var fileLink = `${MINIO_API_URL}` +  fileLink;
    let mediaElement;
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
        mediaElement = (<div key={fileLink} class="media-component image flex"><img src={fileLink} alt="Image" class="image" /></div>)
    } else if (['mp4', 'webm', 'ogg', 'avi'].includes(extension)) {
        mediaElement = (<div key={fileLink} class="media-component video flex" width="100%"><video controls width="100%"><source src={fileLink} type={`video/${extension}`}/>Your browser does not support the video tag.</video></div>)
    } else if (['mp3', 'ogg', 'wav', 'aac'].includes(extension)) {
        mediaElement = (<div key={fileLink} class="media-component audio flex"><audio controls><source src={fileLink} type={`audio/${extension}`}/>Your browser does not support the audio element.</audio></div>)
    } else {
        mediaElement = (<div key={fileLink} class="media-component unsupported">Unsupported media type: ${extension}</div>)
    }
    return mediaElement;
}