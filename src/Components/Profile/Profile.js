import React, { useContext, useEffect, useRef, useState } from 'react';
import './Profile.css';
import { ReactComponent as CloseSvg } from './img/close.svg';
import { ReactComponent as StarSvg } from './img/star.svg';
import { ReactComponent as Cross } from './img/cross.svg';
import { Context } from '../..';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Placeholder from './img/placeholder.png';

function Profile() {

  const navigate = useNavigate()

  let params = useParams()

  const {store} = useContext(Context);

  const [userId, setUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  const [isFrinedsText, setIsFrinedsText] = useState('добавить в друзья');
  const [isFrineds, setIsFrineds] = useState(false);

  useEffect(() => {

    localStorage.removeItem('onTest');
    localStorage.removeItem('onTestAgain');

    const userId = params.userId;

    setUserId(userId);

    const currentUserId = localStorage.getItem('userId');

    setCurrentUserId(currentUserId);
    
    const fetchUserData = async () => {
      setIsLoading(true);

      try {
        const userInfo = await store.userInfo(userId);
        setUserName(userInfo.name);
        setUserSurname(userInfo.surname);
        setUserDescription(userInfo.description);
        setUserImage(userInfo.activeAvatar);
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
      const userId = params.userId; 

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
      const userId = params.userId; 

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

    const checkFriend = async () => {
      setIsLoading(true);
      const userId = params.userId; 
      
      if (userId != currentUserId) {
        try {
          const response = await store.checkFriend(userId);
          var count = 0;
          setIsFrineds(response.youSubscribed)
          if (response.youSubscribed) { count++ };
          if (response.yourSubscriber) { count += 2 };
          switch (count) {
            case 1:
              setIsFrinedsText('отписаться');
              break;
            case 2:
              setIsFrinedsText('добавить в ответ');
              break;
            case 3:
              setIsFrinedsText('удалить из друзей');
              break;
          }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        } finally {
            setIsLoading(false);
        }
      }
    };

    fetchUserData();
    fetchUserPosts();
    fetchUserFriends();
    checkFriend();
  }, [])

  const [isModalShow, setIsModalShow] = useState(false);

  const showModel = () => {
    setIsModalShow(true);
  }

  const hideModel = () => {
    setIsModalShow(false);
    setValidText(false); 
  }

  const [isTagsShow, setIsTagsShow] = useState(false);

  const [isTagsEdit, setIsTagsEdit] = useState(false);

  const showTags = () => {
    setIsTagsShow(true);
  }

  const hideTags = () => {
    setIsTagsShow(false);
  }

  const onCreatePost = async (post, postImages) => {
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

const toProfile = async (id) => {
  navigate("/profile/" + id);
  window.location.reload();
};

const subscribe = async (friendId) => {
  if (isFrineds) {
    var response = await store.dellFriend(friendId);
  } else {
    var response = await store.addFriend(friendId);
  }
  window.location.reload();
};

const sendMessage = async (friendId) => {
  navigate("/messages?dm=" + friendId);
};

  const onSubmitPost = (e) => {
          e.preventDefault();
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
            <img className='modal__avatar' src={userImage ? userImage : Placeholder}/>
            <textarea onChange={(e) => setNewPost(e.target.value)} className='modal__input' placeholder='Расскажите нам!'/>
          </div>
          <div className='modal__photos'>
            <label className='modal__photo'>Хотите добавить фото?<input multiple onChange={(e) => setNewPostImages(Object.values(e.target.files))} ref={inputRef} type="file" className='modal__input--image'/></label>
          </div>
          <button type="submit" className='modal__button'>Опубликовать пост</button>
        </form>
        </div>
      }
      {isTagsShow && 
        <div className="modal--bg">
          <form className="profile__tags tags">
            <ul className="tags__pagination">
              <li className="tags__pagination--item"><label><StarSvg/><input defaultChecked type="radio" name="tagsPage"></input></label></li>
              <li className="tags__pagination--item"><label><StarSvg/><input type="radio" name="tagsPage"></input></label></li>
              <li className="tags__pagination--item"><label><StarSvg/><input type="radio" name="tagsPage"></input></label></li>
              <li className="tags__pagination--item"><label><StarSvg/><input type="radio" name="tagsPage"></input></label></li>
              <li className="tags__pagination--item"><label><StarSvg/><input type="radio" name="tagsPage"></input></label></li>
            </ul>
            <div className="tags__wrapper">
              <h2 className="tags__heading">МУЗЫКА</h2>
              <button onClick={hideTags} type="button" className='modal__button--close'><CloseSvg className='modal__icon'/></button>
              { isTagsEdit && <>
                <ul className='tags__pages'>
                <li><label className='tags__pages-label'>1<input defaultChecked type="radio" name="tagsEdit"></input></label></li>
                <li><label className='tags__pages-label'>2<input type="radio" name="tagsEdit"></input></label></li>
                <li><label className='tags__pages-label'>3<input type="radio" name="tagsEdit"></input></label></li>
              </ul>
              <p className="categories__heading">мои категории:</p>
              </>
              }
              <ul className="tags__categories categories">
                <li className="categories__item"><label><input type="checkbox" />к-поп <span className="categories__item-add"><Cross></Cross></span></label></li>
                <li className="categories__item"><label><input type="checkbox" />хип-хоп<span className="categories__item-add"><Cross></Cross></span></label></li>
                <li className="categories__item"><label><input type="checkbox" />рок<span className="categories__item-add"><Cross></Cross></span></label></li>
              </ul>
              {isTagsEdit && <p className="categories__heading">мои теги:</p>}
              <ul className="tags__list">
                <li className="tags__item"><label><input type="checkbox" />#Bts</label></li>
                <li className="tags__item"><label><input type="checkbox" />#Jay-Z</label></li>
                <li className="tags__item"><label><input type="checkbox" />#TheBeatles</label></li>
                <li className="tags__item"><label><input type="checkbox" />#Nirvana</label></li>
              </ul>
              {userId == currentUserId && !isTagsEdit ? <button className='tags__button' type="button" onClick={(e) => setIsTagsEdit(true)}>редактировать</button> : <button className='tags__button' type="button">сохранить</button>}
            </div>
          </form>
        </div>
      }
      <div className="profile__main">
        <section className="profile__bg">
          <img className="profile__bg--img" src={userBannerImage}/>
          <span className="profile__bg--text">COGNI</span>
        </section>
        <section className="profile__human human">
          <div className="human__left">
            <span className="human__avatar-border"><img src={userImage ? userImage : Placeholder} alt=" " className="human__avatar"/>{/*<span className="human__status"></span>*/}</span>
            <span className="human__mbti">{userTypeMBTI}</span>
          </div>
          <div className="human__right">
            <h1 className='human__name'>{userName + " " + userSurname }</h1>
            <p className='human__description'>{userDescription}</p>
            {userId != currentUserId && <div className='human__buttons'><button onClick={(e) => subscribe(userId)} className='human__button-addFriend'>{isFrinedsText}</button><button onClick={(e) => sendMessage(userId)} className='human__button-sendMessage'>сообщение</button></div>}
          </div>
        </section>
        <section className='profile__hobbies hobbies'>
          <h2 className='hobbies__heading'>Увлечения</h2>
          <ul className="hobbies__list">
            {userId == currentUserId && <li className='hobbies__button'>#TheBeatles</li>}
            {userId == currentUserId && <li className='hobbies__button'>#Nirvana</li>}
            <li className='hobbies__button' onClick={showTags}>...</li>
          </ul>
        </section>
        {userId == currentUserId &&
        <section className='profile__addpost addpost'>
          <h2 className='addpost__heading'>Публикации</h2>
          <button onClick={showModel} className='addpost__button'>+ новая публикация</button>
        </section>
        }
        <section className='profile__posts posts'>
          <ul className="posts__list">
            {userPosts.slice(0).reverse().map(post =>
              <li key={post.id} className='posts__item'>
                <div className='posts__author'>
                <img src={userImage ? userImage : Placeholder} alt=" " className='posts__avatar'></img>
                  <div className='posts__info'>
                    <p className='posts__name'>{userName + " " + userSurname}</p>
                    <span className='posts__time'>45 часов назад</span>
                  </div>
                </div>
                <div className='posts__post post'>
                    <p className='post__description'>{post.postBody}</p>
                    <ul className='post__list'>
                      {post.postImages.map(image =>
                        <li key={0} className='post__item'><img className='post__image' src={image}/></li>
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
            <Link to={"/profile/" + userId + "/friends"} className='addons__heading'>Друзья {userFriendsAmount}</Link>
            <ul className='addons__list'>
            {userFriends.map(friend =>
              <li key={friend.id} className='addons__item' onClick={(e) => toProfile(friend.id)}>
                <img className='addons__image' src={friend.url ? friend.url : Placeholder} alt=" "></img>
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

