import React from "react";
import './Wiki.css';

function Wiki() {

    return (
        <div className="wiki">
           <div className="wiki__wrapper">
                <section className="wiki__main">
                    <h1 className="wiki__heading">ВИКИ «Cogni»</h1>
                    <div className="wiki__posts">
                        <h2 className="wiki__posts--heading">Публикации</h2>
                        <ul className="wiki__list">
                            <li className="wiki__item article">
                                <span className="article__banner"><img className="article__img"></img></span>
                                <div className="article__author author">
                                    <img className="author__avatar" alt=""></img>
                                    <span className="author__info">
                                        <p className="author__name">Настя</p>
                                        <span className="author__readers">388 читали | 1 месяц назад</span>
                                        <p className="author__mbti">INFT</p>
                                    </span>
                                </div>
                                <h2 className="article__heading">Как определить свой тип личности: методы типирования</h2>
                                <p className="article__description">В этой статье разберем как определить свой тип личности самостоятельно</p>
                            </li>
                            <li className="wiki__item article">
                                <span className="article__banner"><img className="article__img"></img></span>
                                <div className="article__author author">
                                    <img className="author__avatar" alt=""></img>
                                    <span className="author__info">
                                        <p className="author__name">Настя</p>
                                        <span className="author__readers">388 читали | 1 месяц назад</span>
                                        <p className="author__mbti">INFT</p>
                                    </span>
                                </div>
                                <h2 className="article__heading">Как определить свой тип личности: методы типирования</h2>
                                <p className="article__description">В этой статье разберем как определить свой тип личности самостоятельно</p>
                            </li>
                            <li className="wiki__item article">
                                <span className="article__banner"><img className="article__img"></img></span>
                                <div className="article__author author">
                                    <img className="author__avatar" alt=""></img>
                                    <span className="author__info">
                                        <p className="author__name">Настя</p>
                                        <span className="author__readers">388 читали | 1 месяц назад</span>
                                        <p className="author__mbti">INFT</p>
                                    </span>
                                </div>
                                <h2 className="article__heading">Как определить свой тип личности: методы типирования</h2>
                                <p className="article__description">В этой статье разберем как определить свой тип личности самостоятельно</p>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="wiki__types types">
                    <h3 className="types__heading">Типы личности</h3>
                    <ul className="types__list">
                        <li className="types__item">INFJ</li>
                        <li className="types__item">INFP</li>
                        <li className="types__item">ENFP</li>
                        <li className="types__item">ENFJ</li>
                        <li className="types__item">INTJ</li>
                        <li className="types__item">INTP</li>
                        <li className="types__item">ENTP</li>
                        <li className="types__item">ENTJ</li>
                        <li className="types__item">ISTJ</li>
                        <li className="types__item">ISTP</li>
                        <li className="types__item">ESTP</li>
                        <li className="types__item">ESTJ</li>
                        <li className="types__item">ISFJ</li>
                        <li className="types__item">ISFP</li>
                        <li className="types__item">ESFP</li>
                        <li className="types__item">ESFJ</li>
                    </ul>
                </section>
           </div>
        </div>
    );
};

export default Wiki;

