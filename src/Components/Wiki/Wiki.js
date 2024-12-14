import React from "react";
import './Wiki.css';

function Wiki() {

    return (
        <div className="wiki">
           <div className="wiki__wrapper">
                <section className="wiki__main">
                    <h1 className="wiki__heading">ВИКИ «Cogni»</h1>
                    <div className="wiki__posts">
                        <h2 className="wiki__posts--heading">Публикации(?)</h2>
                        <ul className="wiki__list">
                            <li className="wiki__item">Как определить свой тип личности: методы типирования</li>
                            <li className="wiki__item">MBTI и Сенсорика</li>
                            <li className="wiki__item">Тайные страхи и инстинкты: что такое эннеаграмма</li>
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

