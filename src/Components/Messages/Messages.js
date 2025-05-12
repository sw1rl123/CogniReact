import React, { useState } from "react";
import './Messages.css';
import avatar from './img/maria1.jpeg';
import Placeholder from './img/placeholder.png';
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as SubmitIcon } from './img/submit.svg';
import { ReactComponent as ArrowIcon } from './img/arrow.svg';

function Messages() {

    const [isSended, setIsSended] = useState(false);
    const [inputText, setInputText] = useState('');

    const navigate = useNavigate();

    const location = useLocation();

    const toChat = async () => {
        navigate("/messages/1");
      };

    const exitChat = async () => {
        navigate("/messages");
        setIsSended(true);
      };

    const sendMSG = async () => {
        setIsSended(true);
        setInputText('');
    };

    return (
        <div className="messages">
            {location.pathname == '/messages' && <>
            <section className="messages__header">
                <h2 className="messages__heading">Чаты</h2>
            </section>
            <section className="messages__chats">
                <ul className="messages__list">
                    <li className="messages__item message" onClick={(e) => toChat()}>
                        <img className="message__img" src={avatar ? avatar : Placeholder}></img>
                        <div className="message__info">
                            <div className="message__header">
                                <h3 className="message__title">Мария Степанчук</h3>
                                <span className="message__time">18:35</span>
                            </div>
                            <p className="message__text">Привет завтра во сколько встречаемся?{!isSended && <span className="message__count">1</span>}</p>
                        </div>
                    </li>
                </ul>
            </section>
            </>
            }
            {location.pathname == '/messages/1' && <>
            <section className="messages__chats">
                <div className="chat__header">
                    <ArrowIcon className="chat__icon" onClick={(e) => exitChat()}/>
                    <img className="chat__img" src={avatar ? avatar : Placeholder}></img>
                    <div className="chat__info">
                        <h2 className="chat__name">Мария Степанчук</h2>
                        <span className="chat__status">не в сети</span>
                    </div>
                    <span className="chat__type">ISFP</span>
                </div>
                <div className="chat__dialog">
                    <span className="chat__date">11 мая</span>
                    <p className="chat__message">Привет завтра во сколько встречаемся?<span className="chat__time">18:35</span></p>
                    {isSended && <p className="chat__message chat__message--own">Привет, думаю к 10<span className="chat__time">18:41</span></p>}
                </div>
                <div className='chat__write'>
                    <input className="chat__input" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Сообщение"></input>
                    <SubmitIcon onClick={(e) => sendMSG()}/>
                </div>
            </section>
            </>
            }
        </div>
    );
};

export default Messages;

