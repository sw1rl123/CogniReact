import React, { useContext, useState } from "react";
import './Wiki.css';
import { Context } from '../..';
import { ReactComponent as EditIcon } from './img/edit_article.svg';
import { useNavigate } from "react-router-dom";

function WikiCreate() {

    const navigate = useNavigate();

    const {store} = useContext(Context);

    const [articleHeading, setArticleHeading] = useState(null);
    const [articleText, setArticleText] = useState('');
    const [articleHeight, setArticleHeight] = useState('400px');

    const onCreateArticle = async (userId, articleName, articleBody) => {
        var response = await store.createArticle(userId, articleName, articleBody);
        if(response) {
            navigate("/wiki");
            // window.location.reload();
        }
    };

    const onSubmitArticle = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        onCreateArticle(userId, articleHeading, articleText);
    }

    const textEditor = (func) => {
        var text = document.querySelector('.new-article__textarea'); 
        var pre = document.querySelector('.new-article__text');
        var resultText = '';                                                                         
        if (func == "strong") {
            var selectionText = window.getSelection().toString();
            var preHTML = pre.innerHTML.replace(/<\/{0,1}[a-z]+>/gi, "");
            var start = text.selectionStart;
            var end = text.selectionEnd;
            resultText = '<b>' + selectionText + "</b>";
            preHTML = preHTML.slice(0, start) + resultText + preHTML.slice(end)
            // pre.innerHTML = resultText[0] + resultText[1] + resultText[2];
            console.log(preHTML);
            // var start = selection.startOffset;
            // var end = selection.endOffset;
            // console.log(selected);
        }
    }

    const heightEqualize = (e) => {
        setArticleText(e);
        setTimeout(() => {
            setArticleHeight(400);
            var preHeight = document.querySelector('.new-article__text').scrollHeight;
            setArticleHeight(Math.max(preHeight, 400));
        }, 200);
    }

    return (
        <div className="wiki">
           <div className="wiki__wrapper">
                <section className="wiki__main">
                    <h1 className="wiki__heading">ВИКИ «Cogni» <span className="wiki__icon"><EditIcon/></span></h1>
                    <form onSubmit={onSubmitArticle} className="wiki__write">
                        <div className="wiki__toolbar">
                            {/* <button type="button" onClick={(e) => textEditor('strong')}>B</button> <u>U</u> */}
                        </div>
                        <input onChange={(e) => setArticleHeading(e.target.value)} className="new-article__heading" placeholder="Название статьи"></input>
                        <div className="wiki__text-wrapper">
                            <textarea style={{height: articleHeight}} onChange={(e) => heightEqualize(e.target.value)} value={articleText} className="new-article__textarea"></textarea>
                            <pre className="new-article__text"><span>{articleText.replaceAll(/\n/g, '\n')}</span></pre>
                            {/* <span className="article__stick">|</span> */}
                        </div>
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

