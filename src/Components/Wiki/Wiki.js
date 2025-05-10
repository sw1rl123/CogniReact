import React, { useContext, useEffect, useState } from "react";
import './Wiki.css';
import { ReactComponent as CreateIcon } from './img/create_atricle.svg';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import banner from './img/banner.png';
import photo from './img/photo.jpg';

function Wiki() {

    const navigate = useNavigate();

    const {store} = useContext(Context);

    const [articles, setArticles] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const toCreateArticle = async () => {
        navigate("/wiki/create");
      };

    useEffect(() => {
    
        const fetchArticles = async () => {
        setIsLoading(true);
          
    
          try {
            const articlesDownload = await store.getArticles();
            setArticles(articlesDownload);
          } catch (error) {
              console.error("Failed to fetch user posts:", error);
          } finally {
            setIsLoading(false);
        }
        };
    
        fetchArticles();
      }, [])

      const toArticle = async (id) => {
        navigate("/wiki/" + id);
        window.location.reload();
      };

      if (isLoading) {
        return <></>;
    }

    return (
        <div className="wiki">
           <div className="wiki__wrapper">
                <section className="wiki__main">
                    <h1 className="wiki__heading">ВИКИ «Cogni» <span className="wiki__icon" onClick={(e) => toCreateArticle()}><CreateIcon/></span></h1>
                    <div className="wiki__posts">
                        <h2 className="wiki__posts--heading">Публикации</h2>
                        <ul className="wiki__list">
                            {articles.map(article =>
                            <li onClick={(e) => toArticle(article.idArticle)} key={article.idArticle} className="wiki__item article">
                                <span className="article__banner"><img src={banner} className="article__img"></img></span>
                                <div className="article__author author">
                                    <img src={photo} className="author__avatar" alt=""></img>
                                    <span className="author__info">
                                        <p className="author__name">Илья</p>
                                        <span className="author__readers"></span>
                                        <p className="author__mbti"></p>
                                    </span>
                                </div>
                                <h2 className="article__heading">{article.articleName}</h2>
                                <p className="article__description"></p>
                            </li>
                            )}
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

