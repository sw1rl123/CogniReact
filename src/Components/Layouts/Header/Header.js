import React, { useContext, useState, useEffect } from 'react';
import { ReactComponent as LogoSvg } from './img/logo.svg';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../..';
import './Header.css';
import Placeholder from './img/placeholder.png';

function Header() {

  const {store} = useContext(Context);

  const location = useLocation();

  const [userImage, setUserImage] = useState(null);

  const navigate = useNavigate();

  const search = async (request) => {
    if (location.pathname != '/test') {
      if (request == '' ) {
        navigate("/friends");
      } else {
        const mbtiTypes = ["ENFJ", "ENTJ", "ENFP", "ENTP", "INFJ", "INTJ", "INFP", "INTP", "ISFP", "ISFJ", "ESFP", "ESFJ", "ISTJ", "ISTP", "ESTP", "ESTJ",];

        let mbti = 0;

        mbtiTypes.forEach((substring, index) => {
          if (request.includes(substring)) {
            mbti = index + 1;
            request = request.substr(0, request.indexOf(mbtiTypes[index])) + request.substr(request.indexOf(mbtiTypes[index]) + 5);
          }
        });

        navigate("/friends?text=" + request + "&mbti=" + mbti);
      }
    }
  };

  const logout = async () => {
    let response = await store.logout();
    navigate("/login");
  };

  const toFriends = async (request) => {
    if (location.pathname != '/test') {
      if (request == "") {
        navigate("/friends");
      }
    }
  };

  useEffect(() => {
    
    const userId = localStorage.getItem('userId');

    const fetchUserImage = async () => {
      try {
        const userInfo = await store.userInfo(userId);
        setUserImage(userInfo.activeAvatar);
      } catch (error) {
          console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserImage();
      
    }, [])

  return (
    <header className='header'>
      <div className='header__wrapper'>
        <nav className='header__nav'>
          <div className='header__logo-wrapper'>
            <LogoSvg className='header__logo'></LogoSvg>
            <div className='header__links'>
              <p className='header__title'>COGNI</p>
              <Link to="/about" className='header__about'>О сервисе</Link>
            </div>
          </div>
          <input onClick={(e) => toFriends(e.target.value)} onChange={(e) => search(e.target.value)} className='header__search' placeholder='Найти друга'></input>
            <button onClick={logout} className="header__logout">
              <div className="logout__button">
                <img src={userImage ? userImage : Placeholder} alt=" " className="logout__avatar"/>
                <span className="logout__text">выйти</span>
              </div>
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

