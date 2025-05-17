import React, { useContext, useEffect, useState } from 'react';
import './Test.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../..';
import Header from '../../Layouts/Header/Header';
import { ReactComponent as Arrow } from './img/Arrow.svg';
import { ReactComponent as Humster } from './img/humster.svg';
import { ReactComponent as Ellipse } from './img/ellipse.svg';
import { COGNI_API_URL } from '../../../services/globals';

function Test() {

    const [questionsEI, setQuestionsEI] = useState([]);
    const [questionsSN, setQuestionsSN] = useState([]);
    const [questionsFT, setQuestionsFT] = useState([]);
    const [questionsJP, setQuestionsJP] = useState([]);

    const navigate = useNavigate();

    const {store} = useContext(Context);

    const [user, setUser] = React.useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        mbtiType: '',
    });

    const [tempMbti, setTempMbti] = useState('');

    //Создание пользователя
    const onCreate = async (user) => {
        var response = await store.register(user);
        if(response) {
         navigate('/profile' + localStorage.getItem('userId'));
        }
	};

    const changeMbti = async (newMbti) => {
        var response = await store.updateMbti(newMbti);
        if(response) {
         navigate('/profile/' + localStorage.getItem('userId'));
        }
	};

    //При отправке данных вызывается onCreate
    const onSubmitTest = () => {
        if (!(JP.indexOf(0) == -1)) {
            console.log("Вы ответили не на все вопросы");
        } else {

            var sumEI = EI.reduce((sum, current) => sum + current, 0);
            var sumSN = SN.reduce((sum, current) => sum + current, 0);
            var sumFT = FT.reduce((sum, current) => sum + current, 0);
            var sumJP = JP.reduce((sum, current) => sum + current, 0);

            var mbtiResult = '';

            if (sumEI < 0) {
                mbtiResult += "I"
            } else {
                mbtiResult += "E"
            }

            if (sumSN < 0) {
                mbtiResult += "S"
            } else {
                mbtiResult += "N"
            }

            if (sumFT < 0) {
                mbtiResult += "F"
            } else {
                mbtiResult += "T"
            }

            if (sumJP < 0) {
                mbtiResult += "P"
            } else {
                mbtiResult += "J"
            }

            if (!localStorage.getItem('onTestAgain')) {
                setUser((user) => ({ ...user, name: localStorage.getItem('name')}));
                setUser((user) => ({ ...user, surname: localStorage.getItem('surname')}));
                setUser((user) => ({ ...user, email: localStorage.getItem('email')}));
                setUser((user) => ({ ...user, password: localStorage.getItem('password')}));

                if(user.mbtiType == mbtiResult) {
                    onCreate(user);
                }
            } else {
                setShowResult(true);
                setTempMbti(mbtiResult);
            }
        }
    };

    useEffect(() => {

        if (!localStorage.getItem('onTest')) {
            navigate('/register');
        }

        axios.get(`${COGNI_API_URL}/Test/GetAllQuestions`)
            .then((response) => {
                setQuestionsEI(response.data.questions.slice(0, 15));
                setQuestionsSN(response.data.questions.slice(15, 30));
                setQuestionsFT(response.data.questions.slice(30, 45));
                setQuestionsJP(response.data.questions.slice(45, 60));
             })
             .catch((err) => {
                console.log(err);
             }); 
      }, []);

    const [EI, setEI] = useState(Array(15).fill(0));
    const [SN, setSN] = useState(Array(15).fill(0));
    const [FT, setFT] = useState(Array(15).fill(0));
    const [JP, setJP] = useState(Array(15).fill(0));

    const [showResult, setShowResult] = useState(false);

    const setLetter = (id, number, operation) => {
    if (id <= 15) {
        setEI(prevState => {const newState = [...prevState]; newState[(id - 1) % 15] = number * operation; return newState })
    } else if (id <= 30) {
        setSN(prevState => {const newState = [...prevState]; newState[(id - 1) % 15] = number * operation; return newState })
    } else if (id <= 45) {
        setFT(prevState => {const newState = [...prevState]; newState[(id - 1) % 15] = number * operation; return newState })
    } else {
        setJP(prevState => {const newState = [...prevState]; newState[(id - 1) % 15] = number * operation; return newState })
    }
    };

    const [questPage, setQuestPage] = useState(1);

    useEffect(() => {
        document.getElementById("test").scrollTo(0, 0);
    }, [questPage]);

    const changePage = (number, func) => {
        if (func == 1) {
            if (questPage == 1 && number == -1) {
                return false;
            }
            if (questPage == 12 && number == 1) {
                return false;
            }
            setQuestPage(questPage + number);
        } else {
            setQuestPage(number);
        }
            
    }

    return (
        <div className='test' id="test">
            <Header></Header>
            <div className="test__bg">
            {!showResult && 
            <>
            <div className="test__wrapper">
            <ul className='test__pagination'>
                <li className={"test__pagination-item " + (questPage == 1 && "test__pagination-select")} onClick={() => changePage(1, 2)}>1</li>
                <li className={"test__pagination-item " + (questPage == 2 && "test__pagination-select")} onClick={() => changePage(2, 2)}>2</li>
                <li className={"test__pagination-item " + (questPage == 3 && "test__pagination-select")} onClick={() => changePage(3, 2)}>3</li>
                <li className={"test__pagination-item " + (questPage == 4 && "test__pagination-select")} onClick={() => changePage(4, 2)}>4</li>
                <li className={"test__pagination-item " + (questPage == 5 && "test__pagination-select")} onClick={() => changePage(5, 2)}>5</li>
                <li className={"test__pagination-item " + (questPage == 6 && "test__pagination-select")} onClick={() => changePage(6, 2)}>6</li>
                <li className={"test__pagination-item " + (questPage == 7 && "test__pagination-select")} onClick={() => changePage(7, 2)}>7</li>
                <li className={"test__pagination-item " + (questPage == 8 && "test__pagination-select")} onClick={() => changePage(8, 2)}>8</li>
                <li className={"test__pagination-item " + (questPage == 9 && "test__pagination-select")} onClick={() => changePage(9, 2)}>9</li>
                <li className={"test__pagination-item " + (questPage == 10 && "test__pagination-select")} onClick={() => changePage(10, 2)}>10</li>
                <li className={"test__pagination-item " + (questPage == 11 && "test__pagination-select")} onClick={() => changePage(11, 2)}>11</li>
                <li className={"test__pagination-item " + (questPage == 12 && "test__pagination-select")} onClick={() => changePage(12, 2)}>12</li>
            </ul>
            <button type="button" className={'test__button--page-prev' + (questPage >= 2 && questPage <= 12 ? ' test__button-show' : "")} onClick={() => changePage(-1, 1)}><Arrow/></button>
            <button type="button" className={'test__button--page-next' + (questPage >= 1 && questPage <= 11 ? ' test__button-show' : "")} onClick={() => changePage(1, 1)}><Arrow/></button>
            <ul className={"test__list" + (questPage >= 1 && questPage <= 3 ? " test__list--show" + (questPage % 3): "")}>
                {questionsEI.map(question =>
                    <li key={question.idMbtiQuestion} className='test__item'>
                        <p className='test__question'>
                        {question.question}
                        </p>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 1, -1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Нет</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 0.5, -1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Скорее<br/> нет, чем да</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 0.5, 1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Скореe<br/> да, чем нет</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 1, 1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Да</span></label>
                    </li>
                )}
            </ul>

            <ul className={"test__list" + (questPage >= 4 && questPage <= 6 ? " test__list--show" + (questPage % 3) : "")}>
                {questionsSN.map(question =>
                    <li key={question.idMbtiQuestion} className='test__item'>
                        <p className='test__question'>
                        {question.question}
                        </p>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 1, -1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Нет</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 0.5, -1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Скорее<br/> нет, чем да</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 0.5, 1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Скореe<br/> да, чем нет</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 1, 1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Да</span></label>
                    </li>
                )}
            </ul>

            <ul className={"test__list" + (questPage >= 7 && questPage <= 9 ? " test__list--show" + (questPage % 3) : "")}>
                {questionsFT.map(question =>
                    <li key={question.idMbtiQuestion} className='test__item'>
                        <p className='test__question'>
                        {question.question}
                        </p>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 1, -1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Нет</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 0.5, -1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Скорее<br/> нет, чем да</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 0.5, 1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Скореe<br/> да, чем нет</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 1, 1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Да</span></label>
                    </li>
                )}
            </ul>
            
            <ul className={"test__list" + (questPage >= 10 && questPage <= 12 ? " test__list--show" + (questPage % 3) : "")}>
                {questionsJP.map(question =>
                    <li key={question.idMbtiQuestion} className='test__item'>
                        <p className='test__question'>
                        {question.question}
                        </p>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 1, -1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Нет</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 0.5, -1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Скорее<br/> нет, чем да</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 0.5, 1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Скореe<br/> да, чем нет</span></label>
                        <label className="test__label"><input onChange={() => setLetter(Number(question.idMbtiQuestion), 1, 1)} name={"question" + (Number(question.idMbtiQuestion))} className='test__input' type="radio"></input><span className='test__answer'>Да</span></label>
                    </li>
                )}
            </ul>
            </div>
            {questPage == 12 && <button onClick={(e) => onSubmitTest()} className='test__button'>Завершить тест</button>}
            </>
            }
            {showResult && 
                <div className="result-test">
                    <h1 className="result-test__title">По результатам теста ваш тип личности:</h1>
                    <div className="result-test__flex">
                    <div className="result-test__mbti">
                        <h1>{tempMbti}</h1>
                        <Ellipse/>
                    </div>
                    <div className="result-test__about">
                        <Humster/>
                        <p>INFP – глубокомысленные и чувствительные личности, большие мечтатели и идеалисты. Они вечно ищут смысл жизни и стремятся создать гармонию в своем внутреннем мире. INFP часто чувствуют себя...</p>
                        <button>читать дальше</button>
                    </div>
                    </div>
                    <button className="result-test__button" onClick={() => changeMbti(tempMbti)}>Сохранить результат</button>
                </div>
            }
            </div>
        </div>
      );
    };
    
export default Test;