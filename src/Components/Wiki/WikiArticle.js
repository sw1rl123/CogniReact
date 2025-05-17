import React, { useContext, useEffect, useState } from "react";
import './Wiki.css';
import { ReactComponent as EditIcon } from './img/edit_article.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../..';

function WikiArticle() {

    const [articleName, setArticleName] = useState(null);
    const [articleBody, setArticleBody] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const {store} = useContext(Context);
    let params = useParams()

    useEffect(() => {

        const articleId = params.wikiId;

    
        const fetchArticle = async (articleId) => {
            setIsLoading(true);
          
            try {
                const articlesDownload = await store.getArticle(articleId);
                setArticleName(articlesDownload.articleName);
                setArticleBody(articlesDownload.articleBody);
            } catch (error) {
                console.error("Failed to fetch user posts:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchArticle(articleId);
      }, [])

      if (isLoading) {
        return <></>;
    }

    return (
        <div className="wiki">
           <div className="wiki__wrapper">
                <section className="wiki__main">
                    <h1 className="wiki__heading">ВИКИ «Cogni» <span className="wiki__icon"><EditIcon/></span></h1>
                    <div className="wiki__write">
                        <p className="read-article__heading" placeholder="Название статьи">{articleName}</p>
                        <p className="read-article__text" placeholder="Текст статьи">{articleBody}</p>
                    </div>
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

export default WikiArticle;

