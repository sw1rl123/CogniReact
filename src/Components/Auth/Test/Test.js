import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import './Test.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../..';
import Header from '../../Layouts/Header/Header';
import { ReactComponent as Arrow } from './img/Arrow.svg';
import { ReactComponent as Humster } from './img/humster.svg';
import { ReactComponent as Ellipse } from './img/ellipse.svg';
import { COGNI_API_URL } from '../../../services/globals';

const QUESTIONS_PER_PAGE = 4;
const SCALE = [
    { value: 1, label: 'Совсем не про меня' },
    { value: 2, label: 'Скорее не про меня' },
    { value: 3, label: 'Бывает по-разному' },
    { value: 4, label: 'Скорее про меня' },
    { value: 5, label: 'Точно про меня' },
];

function Test() {
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [questPage, setQuestPage] = useState(1);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const pageCount = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const visibleQuestions = useMemo(
        () => questions.slice((questPage - 1) * QUESTIONS_PER_PAGE, questPage * QUESTIONS_PER_PAGE),
        [questions, questPage]
    );

    useEffect(() => {
        if (!localStorage.getItem('onTest') && !localStorage.getItem('onTestAgain')) {
            navigate('/register');
            return;
        }
        let active = true;
        axios.get(`${COGNI_API_URL}/Sakinorva/GetQuestions`)
            .then(({ data }) => {
                if (!active) return;
                const loadedQuestions = Array.isArray(data) ? data : data.questions;
                if (!Array.isArray(loadedQuestions) || loadedQuestions.length !== 48) {
                    throw new Error('Сервер должен вернуть 48 вопросов нового теста. Проверьте backend.');
                }
                setQuestions(loadedQuestions);
            })
            .catch((e) => setError(e.response?.data?.error || e.message || 'Не удалось загрузить вопросы теста.'))
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [navigate]);

    const previousPage = useRef(questPage);
    useEffect(() => {
        if (previousPage.current !== questPage) {
            previousPage.current = questPage;
            const questionsStart = document.querySelector('.test__wrapper');
            if (questionsStart) {
                questionsStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [questPage]);

    const changePage = (page, relative = false) => {
        const nextPage = relative ? questPage + page : page;
        if (nextPage < 1 || nextPage > pageCount) return;

        if (nextPage > questPage) {
            const questionsToComplete = questions.slice(
                (questPage - 1) * QUESTIONS_PER_PAGE,
                (nextPage - 1) * QUESTIONS_PER_PAGE
            );
            const firstMissing = questionsToComplete.find((q) => !Number.isInteger(answers[q.id]));
            if (firstMissing) {
                setError('Ответьте на все вопросы на текущей странице, прежде чем переходить дальше.');
                return;
            }
        }

        setQuestPage(nextPage);
        setError('');
    };

    const onSubmitTest = async () => {
        const unanswered = questions.filter((q) => !Number.isInteger(answers[q.id]));
        if (unanswered.length) {
            const firstMissingPage = Math.floor(questions.findIndex((q) => q.id === unanswered[0].id) / QUESTIONS_PER_PAGE) + 1;
            setError(`Ответьте на все вопросы. Осталось: ${unanswered.length}.`);
            setQuestPage(firstMissingPage);
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            const { data } = await axios.post(`${COGNI_API_URL}/Sakinorva/Calculate`, { answers });
            setResult(data);
            if (localStorage.getItem('onTestAgain')) {
                return;
            }

            const newUser = {
                name: localStorage.getItem('name') || '',
                surname: localStorage.getItem('surname') || '',
                email: localStorage.getItem('email') || '',
                password: localStorage.getItem('password') || '',
                mbtiType: data.result,
            };
            const created = await store.register(newUser);
            if (created) {
                localStorage.removeItem('onTest');
            }
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'Не удалось рассчитать результат. Попробуйте ещё раз.');
        } finally {
            setSubmitting(false);
        }
    };

    const saveResult = async () => {
        setSubmitting(true);
        setError('');
        try {
            const saved = await store.updateMbti(result.result);
            if (saved) {
                localStorage.removeItem('onTestAgain');
                navigate('/profile/' + localStorage.getItem('userId'));
            } else {
                setError('Не удалось сохранить результат. Проверьте авторизацию и попробуйте ещё раз.');
            }
        } catch (e) {
            setError(e.response?.data?.error || 'Не удалось сохранить результат.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="test" id="test">
            <Header />
            <div className="test__bg">
                {loading && <p className="sakinorva-status">Загружаем вопросы…</p>}
                {!loading && !result && questions.length > 0 && <>
                    <div className="sakinorva-intro">
                        <h1>Тест на тип личности</h1>
                        <p>Оцените, насколько каждое утверждение похоже на вас. Выберите один вариант ответа для каждого вопроса.</p>
                        <p className="sakinorva-progress">Страница {questPage} из {pageCount} · Выполнено {Object.keys(answers).length} из {questions.length}</p>
                    </div>
                    <div className="test__wrapper">
                        <ul className="test__pagination">
                            {Array.from({ length: pageCount }, (_, index) => {
                                const page = index + 1;
                                return <li key={page} className={'test__pagination-item ' + (questPage === page ? 'test__pagination-select' : '')} onClick={() => changePage(page)}>{page}</li>;
                            })}
                        </ul>
                        <button type="button" aria-label="Предыдущая страница" className={'test__button--page-prev' + (questPage > 1 ? ' test__button-show' : '')} onClick={() => changePage(-1, true)}><Arrow /></button>
                        <button type="button" aria-label="Следующая страница" className={'test__button--page-next' + (questPage < pageCount ? ' test__button-show' : '')} onClick={() => changePage(1, true)}><Arrow /></button>
                        <ul className="test__list sakinorva-list">
                            {visibleQuestions.map((question, index) => (
                                <li key={question.id} className="test__item sakinorva-item">
                                    <p className="test__question">{(questPage - 1) * QUESTIONS_PER_PAGE + index + 1}. {question.question}</p>
                                    {question.example && <p className="sakinorva-example">{question.example}</p>}
                                    <div className="sakinorva-scale">
                                        {SCALE.map((option) => (
                                            <label key={option.value} className={'sakinorva-option' + (answers[question.id] === option.value ? ' sakinorva-option-selected' : '')}>
                                                <input type="radio" name={question.id} value={option.value} checked={answers[question.id] === option.value} onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.value }))} />
                                                <span className="sakinorva-option-value">{option.value}</span>
                                                <span className="sakinorva-option-label">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {error && <p role="alert" className="sakinorva-error">{error}</p>}
                    <div className="sakinorva-navigation">
                        {questPage > 1 && <button type="button" className="test__button sakinorva-secondary" onClick={() => changePage(-1, true)}>Назад</button>}
                        {questPage < pageCount
                            ? <button type="button" className="test__button" onClick={() => changePage(1, true)}>Далее</button>
                            : <button type="button" className="test__button" disabled={submitting} onClick={onSubmitTest}>{submitting ? 'Рассчитываем…' : 'Завершить тест'}</button>}
                    </div>
                </>}
                {!loading && !result && questions.length === 0 && error && <p role="alert" className="sakinorva-error">{error}</p>}
                {result && <div className="result-test sakinorva-result">
                    <h1 className="result-test__title">Ваш результат</h1>
                    <div className="result-test__flex">
                        <div className="result-test__mbti"><h1>{result.result}</h1><Ellipse /></div>
                        <div className="result-test__about">
                            <Humster />
                            <p>Предполагаемый тип личности по ответам на вопросы. Это ориентировочная модель самооценки, а не психологический диагноз.</p>
                        </div>
                    </div>
                    <h2>Топ-3 типа</h2>
                    <ol className="sakinorva-top3">
                        {(result.top3 || []).map((item) => <li key={item.type}><strong>{item.type}</strong><span>{item.matchPercent}% совпадения модели</span></li>)}
                    </ol>
                    <h2>Оценки когнитивных функций</h2>
                    <div className="sakinorva-functions">
                        {Object.entries(result.functionStrengthPercent || {}).map(([name, value]) => <div key={name} className="sakinorva-function"><div><strong>{name}</strong><span>{value}%</span></div><div className="sakinorva-bar"><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div></div>)}
                    </div>
                    {error && <p role="alert" className="sakinorva-error">{error}</p>}
                    <button className="result-test__button" disabled={submitting} onClick={localStorage.getItem('onTestAgain') ? saveResult : () => navigate('/profile/' + localStorage.getItem('userId'))}>{submitting ? 'Сохраняем…' : localStorage.getItem('onTestAgain') ? 'Сохранить результат' : 'Продолжить'}</button>
                </div>}
            </div>
        </div>
    );
}

export default Test;
