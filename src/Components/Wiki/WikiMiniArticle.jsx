import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Placeholder from '../Profile/img/placeholder.png';
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
                const userData = await store.userInfo(id);
                setUser(userData || null);
            } catch (e) {
                console.error("Failed to fetch user:", e);
            } finally {
                setIsLoading(false);
            }
        }

        FetchUserData(article.idUser);
    }, []);

    const toArticle = (id) => {
        navigate("/wiki/" + id);
      };

    if (isLoading) {
        return <></>;
    }

  return (
    <li onClick={() => toArticle(article.idArticle)} className="wiki__item article">
        <span className="article__banner"><img src={article.articlePreview ? article.articlePreview : banner} className="article__img"></img></span>
        <div className="article__author author">
            <img src={user?.activeAvatar || article.userProfilePicture || Placeholder} className="author__avatar" alt=""></img>
            <span className="author__info">
                <p className="author__name">{user?.name || article.userName}</p>
                <span className="author__readers">{article.readsNumber || 0} прочтений | {article.timeSincePublication}</span>
                <p className="author__mbti">{user?.typeMbti || article.userMbti}</p>
            </span>
        </div>
        <h2 className="article__heading">{article.articleName}</h2>
        <p className="article__description">{article.annotation}</p>
    </li>
  )
}

export default WikiMiniArticle
