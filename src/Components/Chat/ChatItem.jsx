import React from "react";

export default function ChatItem({
    chatId,
    chatName,
    lastMessage,
    unreadCount,
    isTyping,
    online,
    onClick,
}) {
    return (
        <div id={`chat_${chatId}`} className="chat-item flex flex-col overflow-hidden" onClick={() => onClick(chatId)}>
        <div className="flex items-center w-full">
            {online && (
            <svg
                className="absolute overflow-visible -translate-[10px] -translate-y-[15px]"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                color="#646cff"
                id={`online_status_${chatId}`}
            >
                <circle cy="4" r="8" fill="currentColor" />
            </svg>
            )}
            <a className="truncate" id={`chat_name_${chatId}`}>{chatName}</a>
        </div>

        <div
            id={`chat_preview_content_${chatId}`}
            className={`flex items-center gap-1 overflow-hidden ${isTyping ? "typing" : ""}`}
        >
            <div
            className="truncate w-full chat-extra last_message"
            id={`last_message_${chatId}`}
            >
            {lastMessage}
            </div>

            <div className="flex w-full chat-extra chat_typing gap-1" id={`chat_typing_${chatId}`} style={{ display: isTyping ? "flex" : "none" }}>
            <img src="/assets/SvgSpinners3DotsScale.svg" alt="Typing..." />
            <span className="truncate" id={`chat_typing_name_${chatId}`}>
                {isTyping}
            </span>
            </div>

            <div
            className="unreaden-count"
            id={`unreaden_count_${chatId}`}
            style={{ display: unreadCount > 0 ? "block" : "none" }}
            >
            {unreadCount}
            </div>
        </div>
        </div>
    );
}
