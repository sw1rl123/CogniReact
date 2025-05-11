import React from "react";
import './Messages.css';

function Messages() {

    

    return (
        <div className="messages">
           <section className="messages__header">
                <h2 className="messages__heading">Чаты</h2>
           </section>
           <section className="messages__chats">
             <ul className="messages__list">
                <li className="messages__item message">
                    <img className="message__img" src=""></img>
                    <div className="message__info">
                        <div className="message__header">
                            <h3 className="message__title">Cogni</h3>
                            <span className="message__time">12:15</span>
                        </div>
                        <p className="message__text">Привет привет привет <span className="message__count">12</span></p>
                    </div>
                </li>
                <li className="messages__item message">
                    <img className="message__img" src=""></img>
                    <div className="message__info">
                        <div className="message__header">
                            <h3 className="message__title">Cogni</h3>
                            <span className="message__time">12:15</span>
                        </div>
                        <p className="message__text">Привет привет привет <span className="message__count">12</span></p>
                    </div>
                </li>
                <li className="messages__item message">
                    <img className="message__img" src=""></img>
                    <div className="message__info">
                        <div className="message__header">
                            <h3 className="message__title">Cogni</h3>
                            <span className="message__time">12:15</span>
                        </div>
                        <p className="message__text">Привет привет привет <span className="message__count">12</span></p>
                    </div>
                </li>
             </ul>
           </section>
        </div>
    );
};

export default Messages;

