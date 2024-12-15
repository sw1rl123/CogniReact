import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as LogoSvg } from './img/logo.svg';
import './LoginForm.css';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';

function LoginForm() {

  const [validEnter, setValidEnter] = useState(false);

  const navigate = useNavigate();

  const {store} = useContext(Context);

  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });

  const login = async (user) => {
    var response = await store.login(user);
    if(response) {
      navigate('/profile');
    } else {
      setValidEnter(true);
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
        <div className='login__blur'>
            <div className='login__ball'></div>
            <div className='login__ball'></div>
            <div className='login__ball'></div>
            <div className='login__ball'></div>
        </div>

        {(validEnter) && <span className='loginform__error--enter'><p>Неверный логин или пароль</p></span>}
        <form onSubmit={onSubmit} className='login__form loginform'>
            <h1 className='loginform__header'>Вход в «COGNI»</h1>
            <input
                    value={user?.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    type="text" placeholder='Введите e-mail' className='loginform__input'/>

                <input
                    value={user?.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    type="password" placeholder='Придумайте пароль' className='loginform__input'/>

            <button type="submit" className='loginform__button'>Войти</button>
            <Link to="/register" className='loginform__link'>Зарегистрироваться</Link>
        </form>
       
        <div className='login__info info'>
            <LogoSvg className='info__logo'/>
            <p className='info__logoText'>COGNI</p>
            <a href="" className='info__link'>О сервисе</a>
        </div>
    </div>
  );
};

export default observer(LoginForm);

