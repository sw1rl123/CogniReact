import React from "react";

export default function ChatItem({
    chat,
    onClick,
    online
}) {
    return (
        <div id={`chat_${chat.id}`} className="chat-item flex flex-col overflow-hidden" onClick={() => onClick(chat.id)}>
        <div className="flex items-center w-full">
            {online && (
            <svg
                className="absolute overflow-visible -translate-[10px] -translate-y-[15px]"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                color="#646cff"
                id={`online_status_${chat.id}`}
            >
                <circle cy="4" r="8" fill="currentColor" />
            </svg>
            )}
            <a className="truncate" id={`chat_name_${chat.id}`}>{chat.name}</a>
        </div>

        <div
            id={`chat_preview_content_${chat.id}`}
            className={`flex items-center gap-1 overflow-hidden ${chat.isTyping ? "typing" : ""}`}
        >
            <div
            className="truncate w-full chat-extra last_message"
            id={`last_message_${chat.id}`}
            >
            {chat.lastMessage}
            </div>

            <div className="flex w-full chat-extra chat_typing gap-1" id={`chat_typing_${chat.id}`} style={{ display: chat.isTyping ? "flex" : "none" }}>
            <img src="/assets/SvgSpinners3DotsScale.svg" alt="Typing..." />
            <span className="truncate" id={`chat_typing_name_${chat.id}`}>
                {chat.isTyping}
            </span>
            </div>

            <div
            className="unreaden-count"
            id={`unreaden_count_${chat.id}`}
            style={{ display: chat.unreadCount > 0 ? "block" : "none" }}
            >
            {chat.unreadCount}
            </div>
        </div>
        </div>
    );
}
