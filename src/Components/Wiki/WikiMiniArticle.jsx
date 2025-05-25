import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import banner from './img/banner.png';

function WikiMiniArticle({article}) {

    const navigate = useNavigate();

    const {store} = useContext(Context);

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    

    useEffect(() => {
        const FetchUserData = async (id) => {
            try {
                const user = await store.userInfo(id);
                setUser(user);
                return user;
            } catch (e) {
                console.error("Failed to fetch user:", e);
            } finally {
                setIsLoading(false);
            }
        }

        FetchUserData(article.idUser);
    }, []);

    const toArticle = async (id) => {
        navigate("/wiki/" + id);
        window.location.reload();
      };

    if (isLoading) {
        return <></>;
    }

  return (
    <li onClick={(e) => toArticle(article.id)} className="wiki__item article">
        <span className="article__banner"><img src={article.articlePreview ? article.articlePreview : banner} className="article__img"></img></span>
        <div className="article__author author">
            <img src={user.activeAvatar} className="author__avatar" alt=""></img>
            <span className="author__info">
                <p className="author__name">{user.name}</p>
                <span className="author__readers">{article.readsNumber ? article.readsNumber : 0} читателя | {new Date(article.created).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'}).replaceAll('/', '.')}</span>
                <p className="author__mbti">{user.typeMbti}</p>
            </span>
        </div>
        <h2 className="article__heading">{article.articleName}</h2>
        <p className="article__description">{article.annotation}</p>
    </li>
  )
}

export default WikiMiniArticle
