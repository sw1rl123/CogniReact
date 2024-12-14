import React, { useContext, useEffect, useState } from 'react';
import './Test.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../..';
import Header from '../Layouts/Header/Header';

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

    //Создание пользователя
    const onCreate = async (user) => {
        var response = await store.register(user);
        if(response) {
         navigate('/profile');
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

            setUser((user) => ({ ...user, name: localStorage.getItem('name')}));
            setUser((user) => ({ ...user, surname: localStorage.getItem('surname')}));
            setUser((user) => ({ ...user, email: localStorage.getItem('email')}));
            setUser((user) => ({ ...user, password: localStorage.getItem('password')}));

            setUser((user) => ({ ...user, mbtiType: mbtiResult}));

            console.log(user);

            if(user.mbtiType == mbtiResult) {
                onCreate(user);
            }
        }
    };

    useEffect(() => {
        axios.get("https://localhost:7055/Test/GetAllQuestions")
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

    const changePage = (number) => {
        if (number == 1) {
            var state = true;
            switch (questPage) {
                case 1:
                    if (!(EI.indexOf(0) == -1)) {
                        state = false;
                    }
                    break;
                case 2:
                    if (!(SN.indexOf(0) == -1)) {
                        state = false;
                    }
                    break;
                case 3:
                    if (!(FT.indexOf(0) == -1)) {
                        state = false;
                    }
                    break;
            }
            
            if (state) {
                setQuestPage(questPage + number);

            } else {
                console.log("Вы ответили не на все вопросы");
            }

        } else {
            setQuestPage(questPage + number);
        }
    }

    return (
        <div className='test' id="test">
            <Header></Header>
            <div className="test__bg">
            <div className="test__wrapper">
            {questPage >= 2 && questPage <= 4 && (<button type="button" className='test__button--page-prev' onClick={() => changePage(-1)}>Предыдущие 15 вопросов</button>)}
            {questPage >= 1 && questPage <= 3 && (<button type="button" className='test__button--page-next' onClick={() => changePage(1)}>Следующие 15 вопросов</button>)}
            {questPage >= 2 && questPage <= 4 && (<button type="button" className='test__button--page-prev test__button--page--bottom' onClick={() => changePage(-1)}>Предыдущие 15 вопросов</button>)}
            {questPage >= 1 && questPage <= 3 && (<button type="button" className='test__button--page-next test__button--page--bottom' onClick={() => changePage(1)}>Следующие 15 вопросов</button>)}

            <ul className={"test__list" + (questPage == 1 ? " test__list--show" : "")}>
                {questionsEI.map(question =>
                    <li className='test__item'>
                        <p className='test__question'>
                        {question.question}
                        </p>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 1, -1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Нет</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 0.5, -1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Скорее нет, чем да</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 0.5, 1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Скорее да, чем нет</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 1, 1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Да</span></label>
                    </li>
                )}
            </ul>

            <ul className={"test__list" + (questPage == 2 ? " test__list--show" : "")}>
                {questionsSN.map(question =>
                    <li className='test__item'>
                        <p className='test__question'>
                        {question.question}
                        </p>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 1, -1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Нет</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 0.5, -1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Скорее нет, чем да</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 0.5, 1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Скорее да, чем нет</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 1, 1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Да</span></label>
                    </li>
                )}
            </ul>

            <ul className={"test__list" + (questPage == 3 ? " test__list--show" : "")}>
                {questionsFT.map(question =>
                    <li className='test__item'>
                        <p className='test__question'>
                        {question.question}
                        </p>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 1, -1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Нет</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 0.5, -1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Скорее нет, чем да</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 0.5, 1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Скорее да, чем нет</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 1, 1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Да</span></label>
                    </li>
                )}
            </ul>
            
            <ul className={"test__list" + (questPage == 4 ? " test__list--show" : "")}>
                {questionsJP.map(question =>
                    <li className='test__item'>
                        <p className='test__question'>
                        {question.question}
                        </p>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 1, -1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Нет</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 0.5, -1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Скорее нет, чем да</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 0.5, 1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Скорее да, чем нет</span></label>
                        <label><input onChange={() => setLetter(Number(question.idMbtiQuestion) - 30, 1, 1)} name={"question" + (Number(question.idMbtiQuestion) - 30)} className='test__input' type="radio"></input><span className='test__answer'>Да</span></label>
                    </li>
                )}
            </ul>
            </div>
            {questPage == 4 && <button onClick={() => onSubmitTest()} type="button" className='test__button'>Завершить тест</button>}
            </div>
        </div>
      );
    };
    
export default Test;