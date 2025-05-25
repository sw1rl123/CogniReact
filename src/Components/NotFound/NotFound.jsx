import React from 'react'
import "./NotFound.css"
import maskot from "../../assets/images/maskot-sad.png"
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='notfound'>
      <div className="notfound__bg">
        <div className="notfound__window">
            <div className="notfound__wrapper">
                <h1 className="notfound__error">404</h1>
                <p className="notfound__warning">Страница не найдена</p>
                <p className="notfound__text">Неправильно набран адрес или такой страницы не существует</p>
                <Link to="/" className="notfound__link">На главную</Link>
            </div>
            <img className='notfound__image' src={maskot} alt="" />
        </div>
      </div>
    </div>
  )
}

export default NotFound
