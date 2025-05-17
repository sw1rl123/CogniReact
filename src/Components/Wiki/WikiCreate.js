import React, { useContext, useState } from "react";
import './Wiki.css';
import { Context } from '../..';
import { ReactComponent as EditIcon } from './img/edit_article.svg';
import { useNavigate } from "react-router-dom";

function WikiCreate() {

    const navigate = useNavigate();

    const {store} = useContext(Context);

    const [articleHeading, setArticleHeading] = useState(null);
    const [articleText, setArticleText] = useState(null);

    const onCreateArticle = async (userId, articleName, articleBody) => {
        var response = await store.createArticle(userId, articleName, articleBody);
        if(response) {
            navigate("/wiki");
            window.location.reload();
        }
    };

    const onSubmitArticle = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        onCreateArticle(userId, articleHeading, articleText);
    }

    return (
        <div className="wiki">
           <div className="wiki__wrapper">
                <section className="wiki__main">
                    <h1 className="wiki__heading">ВИКИ «Cogni» <span className="wiki__icon"><EditIcon/></span></h1>
                    <form onSubmit={onSubmitArticle} className="wiki__write">
                        <div className="wiki__toolbar">
                            <b>B</b> <i>I</i> <u>U</u>
                        </div>
                        <input onChange={(e) => setArticleHeading(e.target.value)} className="new-article__heading" placeholder="Название статьи"></input>
                        <textarea onChange={(e) => setArticleText(e.target.value)} className="new-article__text" placeholder="Текст статьи"></textarea>
                        <button type="submit" className="wiki__create-button">Опубликовать</button>
                    </form>
                </section>

                <section className="wiki__types types">
                    <h3 className="types__heading">Ваши статьи</h3>
                    <ul className="types__list">
                    </ul>
                </section>
           </div>
        </div>
    );
};

export default WikiCreate;

