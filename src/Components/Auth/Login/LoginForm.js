import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as LogoSvg } from './img/logo.svg';
import './LoginForm.css';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import maskot from "../../../assets/images/maskot-hi.png"
import { ReactComponent as EyeIcon } from '../../../assets/images/visibility.svg';
import { ReactComponent as EyeOffIcon } from '../../../assets/images/visibility-off.svg';

function LoginForm() {

  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {store} = useContext(Context);

  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });

  const login = async (user) => {
    setLoginError('');
    try {
      const response = await store.login(user);
      if(response) {
        navigate('/profile/' + localStorage.getItem('userId'));
      } else {
        setLoginError('Неверный e-mail или пароль');
      }
    } catch (e) {
      setLoginError(e.response
        ? 'Ошибка сервера при входе. Попробуйте позже.'
        : 'Не удалось подключиться к API. Проверьте, запущен ли Cogni.');
    }
	};

  const onSubmit = (e) => {
    e.preventDefault();
    login(user);
  }

  useEffect(() => {

    localStorage.removeItem('name');
    localStorage.removeItem('surname');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('mbtiType');
    
    if ((localStorage.getItem('userId') && (localStorage.getItem('aToken') || localStorage.getItem('rToken')))) {
        navigate('/');
    }

    }, []);

  return (
    <div className='login__wrapper'>
        {/* <div className='login__blur'>
            <div className='login__ball'></div>
            <div className='login__ball'></div>
            <div className='login__ball'></div>
            <div className='login__ball'></div>
        </div> */}
        <div className="login__bg">

        <div className="login__maskot">
            <p className="login__maskot-text">Добро пожаловать в Cogni — русскоязычную социальную сеть, основанную на типологии MBTI. MBTI — один из самых популярных психологических тестов, который классифицирует людей по тому, как они общаются, переживают эмоции, принимают решения и оценивают себя.</p>
            <img className="login__maskot-image" src={maskot} alt="" />
        </div>

          <form onSubmit={onSubmit} className='login__form loginform'>
              <h1 className='loginform__header'>Вход в «COGNI»</h1>
              <input
                      value={user?.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      type="text" placeholder='Введите e-mail' className='loginform__input'/>

                      <div className='loginform__password'>
                          <input
                              value={user?.password}
                              onChange={(e) => setUser({ ...user, password: e.target.value })}
                              type={showPassword ? 'text' : 'password'}
                              placeholder='Введите пароль'
                              className='loginform__input loginform__input--password'/>
                          <button
                              type="button"
                              className='loginform__eye'
                              onClick={() => setShowPassword((prev) => !prev)}
                              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
                              {showPassword ? <EyeOffIcon fill="currentColor" /> : <EyeIcon fill="currentColor" />}
                          </button>
                          {loginError && <span className='loginform__error--enter'><p>{loginError}</p></span>}
                      </div>
                      <button type="submit" className='loginform__button'>Войти</button>
              <Link to="/register" className='loginform__link'>Зарегистрироваться</Link>
          </form>
        
          <div className='login__info info'>
              <LogoSvg className='info__logo'/>
              <p className='info__logoText'>COGNI</p>
              <a href="" className='info__link'>О сервисе</a>
          </div>
        </div>
    </div>
  );
};

export default observer(LoginForm);