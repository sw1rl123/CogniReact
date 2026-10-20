import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as LogoSvg } from './img/logo.svg';
import { ReactComponent as InfoIcon } from './img/info-icon.svg';
import { isFormValid, isFormMbtiValid } from "../../../services/auth.js";
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import maskot from "../../../assets/images/maskot-hi.png"
import './RegisterForm.css';


function RegisterForm() {

    const navigate = useNavigate();

    const {store} = useContext(Context);

    //2 шага регистрации
    const [formStep, setFormStep] = React.useState(0);

    const completeFormStep = () => {
        let validStatus = isFormValid(user, passwordRepeat);
        setValidName(false);
        setValidSurname(false);
        setValidEmail(false);
        setValidPassword(false);
        setValidPasswordRepeat(false);
        setValidAgree(false);

        if (validStatus.status && agree) {
            setUser({
                ...user,
                name: user.name.charAt(0).toUpperCase() + user.name.slice(1),
                surname: user.surname.charAt(0).toUpperCase() + user.surname.slice(1),
            });
            setFormStep(cur => cur + 1);
        } else {
            
            if (validStatus.name) {
                setValidName(true);
            }
            if (validStatus.surname) {
                setValidSurname(true);
            }
            if (validStatus.email) {
                setValidEmail(true);
            }
            if (validStatus.password) {
                setValidPassword(true);
            }
            if (validStatus.passwordRepeat) {
                setValidPasswordRepeat(true);
            }
            if (!agree) {
                setValidAgree(true);
            }
        }
    };

    //Создание пользователя
    const onCreate = async (user) => {
        var response = await store.register(user);
        if(response) {
         navigate('/profile/' + localStorage.getItem('userId'));
        }
	};

    //При отправке данных вызывается onCreate
    const onSubmit = (e) => {
        e.preventDefault();
        let validStatus = isFormMbtiValid(user);
        setValidMBTI(false);
        if (validStatus.status) {
            onCreate(user);
        } else {
            if(validStatus.mbti) {
                setValidMBTI(true);
            }
        }
    }

    const onTest = (e) => {
        localStorage.setItem('name', user.name);
        localStorage.setItem('surname', user.surname);
        localStorage.setItem('email', user.email);
        localStorage.setItem('password', user.password);
        localStorage.setItem('onTest', true);
        navigate('/test');
    }

    const [user, setUser] = React.useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        mbtiType: '',
    });

    const [passwordRepeat, setPasswordRepeat] = React.useState('');

    const [validName, setValidName] = React.useState(false);
    const [validSurname, setValidSurname] = React.useState(false);
    const [validEmail, setValidEmail] = React.useState(false);
    const [validPassword, setValidPassword] = React.useState(false);
    const [validPasswordRepeat, setValidPasswordRepeat] = React.useState(false);
    const [validMBTI, setValidMBTI] = React.useState(false);
    const [agree, setAgree] = React.useState(false);
    const [validAgree, setValidAgree] = React.useState(false);
    const [mbtiOpen, setMbtiOpen] = React.useState(false);
    const mbtiTypes = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'];

    useEffect(() => {

        localStorage.removeItem('name');
        localStorage.removeItem('surname');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('mbtiType');
        localStorage.removeItem('onTest');
        localStorage.removeItem('onTestAgain');
    
        if ((localStorage.getItem('userId') && (localStorage.getItem('aToken') || localStorage.getItem('rToken')))) {
            navigate('/');
        }

    }, []);


  return (
    <div className='login__wrapper'>
        <div className="login__bg">
            {/* <div className='login__blur'>
                <div className='login__ball'></div>
                <div className='login__ball'></div>
                <div className='login__ball'></div>
                <div className='login__ball'></div>
            </div> */}

            <div className="login__maskot">
                <p className="login__maskot-text">Добро пожаловать в Cogni — русскоязычную социальную сеть, основанную на типологии MBTI. MBTI — один из самых популярных психологических тестов, который классифицирует людей по тому, как они общаются, переживают эмоции, принимают решения и оценивают себя.</p>
                <img className="login__maskot-image" src={maskot} alt="" />
            </div>
            
            <form onSubmit={onSubmit} className='login__form loginform'>
                {formStep === 0 &&  (<section>
                    <h1 className='loginform__header'>Регистрация</h1>
                    <input 
                        value={user?.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        type="text" placeholder='Имя' className='loginform__input'/>
                    {(validName) && <span className='loginform__error'><InfoIcon></InfoIcon><p>Имя должно быть написано на русском и содержать минимум 2 символа</p></span>}

                    <input 
                        value={user?.surname}
                        onChange={(e) => setUser({ ...user, surname: e.target.value })}
                        type="text" placeholder='Фамилия' className='loginform__input'/>
                    {(validSurname) && <span className='loginform__error'><InfoIcon></InfoIcon><p>Фамилия должна быть написана на русском и содержать минимум 2 символа</p></span>}

                    <input
                        value={user?.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        type="text" placeholder='Введите e-mail' className='loginform__input'/>
                    {(validEmail) && <span className='loginform__error'><InfoIcon></InfoIcon><p>Email указан не верно</p></span>}

                    <input
                        value={user?.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        type="password" placeholder='Придумайте пароль' className='loginform__input'/>
                    {(validPassword) && <span className='loginform__error'><InfoIcon></InfoIcon><p>Пароль должен состоять минимум из 8 символов и содержать хотя бы одну цифру/букву и один из символов: !@#$%^&*</p></span>}

                    <input
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    type="password" placeholder='Подтвердите пароль' className='loginform__input'/>
                    {(validPasswordRepeat) && <span className='loginform__error'><InfoIcon></InfoIcon><p>Пароли не совпадают</p></span>}

                    <label htmlFor="agreeRadio" className='loginform__label'>
                        <input
                            type="checkbox"
                            className='loginform__radio'
                            id="agreeRadio"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        <p>Согласен на обработку персональных данных <a href="" className='loginform__agree'>Пользовательское соглашение</a></p>
                    </label>
                    {validAgree && <p className='loginform__agree-error'>Отметьте согласие, чтобы продолжить</p>}

                    <button onClick={completeFormStep} type="button" className='loginform__button'>Продолжить</button>
                    <p className='loginform__desc'>Уже есть аккаунт?</p>
                    <Link to="/login" className='loginform__link color-green'>Войти</Link>
                </section>
                )}

                {formStep === 1 &&  (<section>
                    <h1 className='loginform__header'>Введите свой тип <br/> личности</h1>
                    <div className='mbti-select'>
                        <button type="button" className='loginform__input mbti-select__field' onClick={() => setMbtiOpen(!mbtiOpen)}>
                            <span className={user.mbtiType ? 'mbti-select__value' : ''}>{user.mbtiType || 'Ваш MBTI'}</span>
                            <svg className={mbtiOpen ? 'mbti-select__arrow mbti-select__arrow--open' : 'mbti-select__arrow'} width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19.92 8.95L13.4 15.47c-.77.77-2.03.77-2.8 0L4.08 8.95" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {mbtiOpen && (
                            <ul className='mbti-select__list'>
                                {mbtiTypes.map((type) => (
                                    <li key={type}>
                                        <button type="button" className='mbti-select__option' onClick={() => { setUser({ ...user, mbtiType: type }); setMbtiOpen(false); }}>{type}</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {(validMBTI) && <span className='loginform__error'><InfoIcon></InfoIcon><p>Вы не выбрали MBTI</p></span>}

                    <button type="submit" className='loginform__button'>Зарегистрироваться</button>
                    <p className='loginform__text'>или</p>
                    <button onClick={onTest} type="button" className='loginform__button-other'>Пройти тест <br/> и узнать свой тип</button>
                </section>
                )}
            </form>
        
            <div className='login__info info'>
                <LogoSvg className='info__logo'/>
                <p className='info__logoText'>COGNI</p>
                <a href="#" className='info__link'>О сервисе</a>
            </div>
        </div>
    </div>
  );
};

export default observer(RegisterForm);
