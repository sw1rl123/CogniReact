import React, { useContext, useEffect, useRef, useState } from 'react';
import './Settings.css';
import { Context } from '../..';
import { ReactComponent as CloseSvg } from './img/close.svg';
import { useNavigate } from 'react-router-dom';

function Settings() {


  const {store} = useContext(Context);

  const navigate = useNavigate();

  const [userName, setUserName] = useState(null);
  const [userSurname, setUserSurname] = useState(null);
  const [userDescription, setUserDescription] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userBannerImage, setUserBannerImage] = useState(null);
  const [userTypeMBTI, setUserTypeMBTI] = useState(null);

  const [space, setSpace] = useState(" ");

  const [editNameStatus, setEditNameStatus] = useState("Изменить");
  const [editDescStatus, setEditDescStatus] = useState("Изменить");

  const [userOldPassword, setUserOldPassword] = useState("");
  const [userNewPassword, setUserNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isModalShow, setIsModalShow] = useState(false);
  const [imageSpec, setImageSpec] = useState(null);

  const [newImage, setNewImage] = useState([]);

  const inputRef = useRef();

  const setNewName = (e) => {
    if (e.indexOf(' ') != -1) {
      setSpace(" ");
      setUserSurname(e.substr(e.indexOf(' ') + 1));
    } else {
      setSpace("");
      setUserName(e.substr(0));
    }
  }

  const setNewDesc = (e) => {
    setUserDescription(e);
  }

  const setStatusName = () => {
    if(editNameStatus == 'Сохранить') {
      // проверку сюда добавить
      updateUserName(userName, userSurname);
    } else {
      setEditNameStatus('Сохранить');
    }
  }

  const setStatusDesc = () => {
    if(editDescStatus == 'Сохранить') {
      updateUserDesc(userDescription);
    } else {
      setEditDescStatus('Сохранить');
    }
  }

  const showModel = (value) => {
    if (value == 1) {
      setImageSpec(value);
    } else {
      setImageSpec(value);
    }
    setIsModalShow(true);
  }

  const hideModel = () => {
    setIsModalShow(false);
  }

  const updateUserName = async (userName, userSurname) => {
    var response = await store.updateUserName(userName, userSurname);
    if(response) {
      window.location.reload();
    }
  };

  const updateUserDesc = async (userDesc) => {
    var response = await store.updateUserDesc(userDesc);
    if(response) {
      window.location.reload();
    }
  };

  const updatePassword = async () => {
    var response = await store.updatePassword(userOldPassword, userNewPassword);
    if(response) {
      window.location.reload();
    }
  };

  const onUpdateImageAvatar = async (Image) => {
    var response = await store.updateImageAvatar(Image);
    if(response) {
      hideModel();
      window.location.reload();
    }
  };

  const onUpdateImageBanner = async (Image) => {
    var response = await store.updateImageBanner(Image);
    if(response) {
      hideModel();
      window.location.reload();
    }
  };

  const onSubmitImage = (e) => {
    e.preventDefault();
    if (imageSpec == 1 && newImage.length > 0) {
      onUpdateImageAvatar(newImage);
      setImageSpec(0);
    }
    else if (imageSpec == 2 && newImage.length > 0) {
      onUpdateImageBanner(newImage);
      setImageSpec(0);
    }
    
}

  const openTest = (e) => {
    localStorage.setItem('onTestAgain', true);
    localStorage.setItem('onTest', true);
    navigate('/test');
  }

  useEffect(() => {

    const fetchUserData = async () => {
      setIsLoading(true);
      const userId = localStorage.userId; 
      

      try {
        const userInfo = await store.userInfo(userId);
        setUserName(userInfo.name);
        setUserSurname(userInfo.surname);
        if(userInfo.description == null) {
          setUserDescription('');
        } else {
          setUserDescription(userInfo.description);
        }
        setUserImage(userInfo.image);
        setUserBannerImage(userInfo.bannerImage);
        setUserTypeMBTI(userInfo.typeMbti);
      } catch (error) {
          console.error("Failed to fetch user data:", error);
      } finally {
          setIsLoading(false);
      }
    };

    fetchUserData();
    
  }, [])

  if (isLoading) {
    return <></>;
}

  return (
    <div className='settings__wrapper'>
      {isModalShow && 
        <div className='modal--bg'>
        <form onSubmit={onSubmitImage} className='profile__modal modal'>
          <div className='modal__header'>
            <h2 className='modal__heading'>Изменить изображение</h2>
            <button onClick={hideModel} type="button" className='modal__button--close'><CloseSvg className='modal__icon'/></button>
          </div>
          <div className='modal__photos'>
            <label className='modal__photo'>Загрузить изображение<input onChange={(e) => setNewImage(Object.values(e.target.files))} ref={inputRef} type="file" className='modal__input--image'/></label>
          </div>
          <button type="submit" className='modal__button'>Сохрнаить фото профиля</button>
        </form>
        </div>
      }
      <form className="settings__main" autoComplete="off">
        <section className="settings__bg">
          <img className="settings__bg--img" src={userBannerImage}/>
          <span className="settings__bg--text">COGNI</span>
          <span className="settings__bg-edit" onClick={(e) => showModel(2)}>Изменить обложку</span>
        </section>
        <section className="settings__human human">
          <div className="human__left">
            <span className="human__avatar-border"><img onClick={(e) => showModel(1)} src={userImage} alt=" " className="human__avatar"/><span className="human__avatar-edit">+</span></span>
            <span className="human__mbti"></span>
          </div>
          <div className="human__right">
            <h1 className='human__name'><input className="human__name-input" onChange={(e) => setNewName(e.target.value)} id="human-name-edit" value={userName + space + userSurname }></input><label onClick={setStatusName} htmlFor="human-name-edit" className='human__name-edit'>{editNameStatus}</label></h1>
            <p className='human__description'><span className='human__description-text'><textarea autoComplete="none" className="human__description-input" onChange={(e) => setNewDesc(e.target.value)} id="human-desc-edit" value={userDescription}></textarea></span><label onClick={setStatusDesc} htmlFor="human-desc-edit" className='human__description-edit'>{editDescStatus}</label></p>
          </div>
        </section>
        <section className='settings__info'>
          <div className="settings__type">
            <h2 className="settings__type-heading">Изменить тип личность</h2>
            <div>
            <p className="settings__type-mbti">
              <span className="mbti-letter">{userTypeMBTI[0]}</span>
              <span className="mbti-letter">{userTypeMBTI[1]}</span>
              <span className="mbti-letter">{userTypeMBTI[2]}</span>
              <span className="mbti-letter">{userTypeMBTI[3]}</span>
            </p>
            <button className="settings__type-button" onClick={(e) => openTest()}>Пройти тест заново</button>
            </div>
          </div>
          <div className="settings__password">
            <h2 className="settings__password-heading">Изменить пароль</h2>
            <div className="settings__password-edit">
              <input className="settings__password-input" type="password" placeholder="Старый пароль" value={userOldPassword} onChange={(e) => setUserOldPassword(e.target.value)}></input>
              <input className="settings__password-input" type="password" placeholder="Новый пароль" value={userNewPassword} onChange={(e) => setUserNewPassword(e.target.value)}></input>
            </div>
          </div>
          <button className="settings__save-button" onClick={updatePassword} type="button">Сохранить пароль</button>
        </section>
      </form>
    </div>
  );
};

export default Settings;

