import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {

  const navigate = useNavigate();

  const refreshPage = async () => {
    navigate("/profile/" + localStorage.getItem('userId'));
    window.location.reload();
  };

  return (
    <nav className="navigation">
        <button onClick={refreshPage} className='navigation__link'>Мой профиль</button>
        <Link to="/messages" className='navigation__link'>Чаты</Link>
        <Link to="/wiki" className='navigation__link'>Вики</Link>
        <Link to="/settings" className='navigation__link'>Настройки</Link>
    </nav>
  );
};

export default Navigation;

