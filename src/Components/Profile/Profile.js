import React, { useContext, useEffect, useRef, useState } from 'react';
import './Profile.css';
import { ReactComponent as CloseSvg } from './img/close.svg';
import { Context } from '../..';
import { useNavigate } from 'react-router-dom';

function Profile() {

  const navigate = useNavigate()

  const {store} = useContext(Context);

  const [userName, setUserName] = useState(null);
  const [userSurname, setUserSurname] = useState(null);
  const [userDescription, setUserDescription] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userBannerImage, setUserBannerImage] = useState(null);
  const [userTypeMBTI, setUserTypeMBTI] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [userPosts, setUserPosts] = useState([]);

  const [userFriends, setUserFriends] = useState([]);
  const [userFriendsAmount, setUserFriendsAmount] = useState([]);

  useEffect(() => {

    const userId = localStorage.userId; 
    
    const fetchUserData = async () => {
      setIsLoading(true);

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

    const fetchUserPosts = async () => {
      setIsLoading(true);
      const userId = localStorage.userId; 

      try {
        const userPostsDownload = await store.getPosts(userId);
        setUserPosts(userPostsDownload);
      } catch (error) {
          console.error("Failed to fetch user posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserFriends = async () => {
      setIsLoading(true);
      const userId = localStorage.userId; 
      

      try {
        const friends = await store.getFriends(userId);
        setUserFriends(friends);
      } catch (error) {
          console.error("Failed to fetch user data:", error);
      } finally {
          setIsLoading(false);
      }

      try {
        const friendsAmount = await store.getFriendsAmount(userId);
        setUserFriendsAmount(friendsAmount);
      } catch (error) {
          console.error("Failed to fetch user data:", error);
      } finally {
          setIsLoading(false);
      }
    };

    fetchUserData();
    fetchUserPosts();
    fetchUserFriends();
  }, [])

  const [isModalShow, setIsModalShow] = useState(false);

  const showModel = () => {
    setIsModalShow(true);
  }

  const hideModel = () => {
    setIsModalShow(false);
    setValidText(false); 
  }

  const onCreatePost = async (post, postImages) => {
    console.log(post, postImages);
    var response = await store.createPost(post, postImages);
    if(response) {
      hideModel();
      window.location.reload();
    }
};

const [newPost, setNewPost] = useState('');
const [newPostImages, setNewPostImages] = useState([]);
const [validText, setValidText] = useState(false);

const inputRef = useRef();

  const onSubmitPost = (e) => {
          e.preventDefault();
          console.log(newPostImages);
          if (newPost.length > 0 || newPostImages.length > 0) {
            onCreatePost(newPost, newPostImages);
            setValidText(false); 
          } else {
            setValidText(true);
          }
           
      }

  if (isLoading) {
    return <></>;
}

  return (
    <div className='profile__wrapper'>
      {isModalShow && 
        <div className='modal--bg'>
        <form onSubmit={onSubmitPost} className='profile__modal modal'>
        {(validText) && <span className='profile__post--error'><p>Вы не заполнили публикацию</p></span>}
          <div className='modal__header'>
            <h2 className='modal__heading'>Что у вас нового?</h2>
            <span className='modal__description'>Поделитесь с друзьями!</span>
            <button onClick={hideModel} type="button" className='modal__button--close'><CloseSvg className='modal__icon'/></button>
          </div>
          <div className='modal__body'>
            <img className='modal__avatar' src={userImage}/>
            <textarea onChange={(e) => setNewPost(e.target.value)} className='modal__input' placeholder='Расскажите нам!'/>
          </div>
          <div className='modal__photos'>
            <label className='modal__photo'>Хотите добавить фото?<input multiple onChange={(e) => setNewPostImages(Object.values(e.target.files))} ref={inputRef} type="file" className='modal__input--image'/></label>
          </div>
          <button type="submit" className='modal__button'>Опубликовать пост</button>
        </form>
        </div>
      }
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
        <section className='profile__addpost addpost'>
          <h2 className='addpost__heading'>Публикации</h2>
          <button onClick={showModel} className='addpost__button'>+ новая публикация</button>
        </section>
        <section className='profile__posts posts'>
          <ul className="posts__list">
            {userPosts.map(post =>
              <li className='posts__item'>
                <div className='posts__author'>
                  <img src={userImage} className='posts__avatar'></img>
                  <div className='posts__info'>
                    <p className='posts__name'>{userName + " " + userSurname}</p>
                    <span className='posts__time'>45 часов назад</span>
                  </div>
                </div>
                <div className='posts__post post'>
                    <p className='post__description'>{post.postBody}</p>
                    <ul className='post__list'>
                      {post.postImages.map(image =>
                        <li className='post__item'><img className='post__image' src={image}/></li>
                      )}
                    </ul>
                </div>
              </li>
            )}
          </ul>
        </section>
      </div>
      <div className="profile__addons addons">
        <section className='addons__friends'>
            <h3 className='addons__heading'>Друзья {userFriendsAmount}</h3>
            <ul className='addons__list'>
            {userFriends.map(friend =>
              <li className='addons__item'>
                <img className='addons__image' src={friend.url}></img>
              </li>
            )}
            </ul>
        </section>
        <section className='addons__more'></section>
      </div>
    </div>
  );
};

export default Profile;

