import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {

  const navigate = useNavigate();

  const location = useLocation();

  const [activePage, setActivePage] = useState([false, false, false, false]);

  const refreshPage = async () => {
    navigate("/profile/" + localStorage.getItem('userId'));
    window.location.reload();
  };

  useEffect(() => {
    if (location.pathname == '/messages') {
      setActivePage([false, true, false, false])
    } else if(location.pathname == '/wiki'){
      setActivePage([false, false, true, false])
    } else if(location.pathname  == '/settings'){
      setActivePage([false, false, false, true])
    } else if(location.pathname.substring(0, 8) == '/profile'){
      setActivePage([true, false, false, false])
    } else {
      setActivePage([false, false, false, false])
    }
  }, [location])

  return (
    <nav className="navigation">
        <button onClick={refreshPage} className={'navigation__link' + (activePage[0] ? ' navigation__link--active' : '' )}>Мой профиль</button>
        <Link to="/messages" className={'navigation__link' + (activePage[1] ? ' navigation__link--active' : '' )}>Чаты</Link>
        <Link to="/wiki" className={'navigation__link' + (activePage[2] ? ' navigation__link--active' : '' )}>Вики</Link>
        <Link to="/settings" className={'navigation__link' + (activePage[3] ? ' navigation__link--active' : '' )}>Настройки</Link>
    </nav>
  );
};

export default Navigation;

