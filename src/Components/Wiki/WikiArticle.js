import React, { useContext, useEffect, useState } from "react";
import './Wiki.css';
import { ReactComponent as EditIcon } from './img/edit_article.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../..';

function WikiArticle() {

    const [articleName, setArticleName] = useState("");
    const [articleBody, setArticleBody] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [article, setArticle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const currentUserId = Number(localStorage.getItem("userId"));
    const isAuthor = article && Number(article.idUser) === currentUserId && currentUserId > 0;

    const {store} = useContext(Context);
    let params = useParams()

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true);
          
            try {
                const articleData = await store.getArticle(params.wikiId);
                if (!articleData) {
                    throw new Error("Статья не найдена");
                }
                setArticle(articleData);
                setArticleName(articleData.articleName || "");
                setArticleBody(articleData.articleBody || "");
            } catch (error) {
                console.error("Ошибка загрузки статьи:", error);
                setError("Не удалось загрузить статью");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchArticle();
    }, [store, params.wikiId]);

    const startEditing = () => {
        setArticleName(article.articleName || "");
        setArticleBody(article.articleBody || "");
        setError("");
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setArticleName(article.articleName || "");
        setArticleBody(article.articleBody || "");
        setError("");
        setIsEditing(false);
    };

    const handleUpdateArticle = async (e) => {
        e.preventDefault();

        if (!articleName.trim() || !articleBody.trim()) {
            setError("Название и текст статьи не могут быть пустыми");
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            const updatedArticle = await store.updateArticle(params.wikiId, articleName, articleBody);
            setArticle({...article, articleName: updatedArticle.articleName || articleName, articleBody: updatedArticle.articleBody || articleBody});
            setIsEditing(false);
        } catch (error) {
            console.error("Ошибка обновления статьи:", error);

            if (error.response?.status === 403) {
                setError("У вас нет прав на редактирование этой статьи");
            } else {
                setError("Не удалось обновить статью. Попробуйте ещё раз.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <></>;
    }

    if (!article) {
        return (
            <div className="wiki">
                <div className="wiki__wrapper">
                    <section className="wiki__main">
                        <h1 className="wiki__heading">ВИКИ «Cogni»</h1>
                        <div className="wiki__write">
                            <p>{error || "Статья не найдена"}</p>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="wiki">
           <div className="wiki__wrapper">
                <section className="wiki__main">
                    <h1 className="wiki__heading">ВИКИ «Cogni»
                        {isAuthor && !isEditing && (
                            <button type="button" className="wiki__icon wiki__edit-button" onClick={startEditing} title="Редактировать статью"><EditIcon /></button>
                        )}
                    </h1>

                    {isEditing ? (
                        <form className="wiki__write" onSubmit={handleUpdateArticle}>
                            <input className="new-article__heading" value={articleName} onChange={(e) => setArticleName(e.target.value)} placeholder="Название статьи"/>
                            <textarea className="new-article__text wiki__edit-textarea" value={articleBody} onChange={(e) => setArticleBody(e.target.value)} placeholder="Основной текст..." />
                            {error && (<p className="wiki__edit-error">{error}</p>)}
                            <button type="submit" className="wiki__create-button" disabled={isSaving}>{isSaving ? "Сохранение..." : "Опубликовать"}</button>
                            <button type="button" className="wiki__cancel-button" onClick={cancelEditing} disabled={isSaving}>Отмена</button>
                        </form>
                    ) : (
                        <div className="wiki__write">
                            <h2 className="read-article__heading">{article.articleName}</h2>
                            <pre className="read-article__text">{article.articleBody}</pre>
                        </div>
                    )}
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

