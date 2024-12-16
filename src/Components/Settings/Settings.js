import React, { useContext, useEffect, useState } from 'react';
import './Settings.css';
import { Context } from '../..';

function Settings() {


  const {store} = useContext(Context);

  const [userName, setUserName] = useState(null);
  const [userSurname, setUserSurname] = useState(null);
  const [userDescription, setUserDescription] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userBannerImage, setUserBannerImage] = useState(null);
  const [userTypeMBTI, setUserTypeMBTI] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const userId = localStorage.userId; 
      

      try {
        const userInfo = await store.userInfo(userId);
        setUserName(userInfo.name);
        setUserSurname(userInfo.surname);
        setUserDescription(userInfo.description);
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
    <div className='profile__wrapper'>
      <div className="profile__main">
        <section className="profile__bg">
          <img className="profile__bg--img" src={userBannerImage}/>
        </section>
        <section className="profile__human human">
          <div className="human__left">
            <img src={userImage} className="human__avatar"/>
            <span className="human__mbti">{userTypeMBTI}</span>
          </div>
          <div className="human__right">
            <h1 className='human__name'>{userName + " " + userSurname }</h1>
            <p className='human__description'>{userDescription}</p>
          </div>
        </section>
        <section className='profile__hobbies hobbies'>
          <h2 className='hobbies__heading'>Увлечения</h2>
          <ul className="hobbies__list">
            <li className='hobbies__item'>#рисование</li>
            <li className='hobbies__item'>#рок</li>
            <li className='hobbies__item'>#рисование</li>
            <li className='hobbies__item'>#пение</li>
            <li className='hobbies__item'>#танцы</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Settings;

