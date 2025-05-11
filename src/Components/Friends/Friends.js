import React, { useContext, useEffect, useRef, useState } from 'react';
import './Friends.css';
import { Context } from '../..';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Placeholder from './img/placeholder.png';

function Frineds() {

  const navigate = useNavigate()

  const mbtiTypes = ["ENFJ", "ENTJ", "ENFP", "ENTP", "INFJ", "INTJ", "INFP", "INTP", "ISFP", "ISFJ", "ESFP", "ESFJ", "ISTJ", "ISTP", "ESTP", "ESTJ",];

  let params = useParams()

  let location = useLocation();
  
  const {store} = useContext(Context);

  const [userId, setUserId] = useState(null);

  const [userName, setUserName] = useState(null);
  const [userSurname, setUserSurname] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userTypeMBTI, setUserTypeMBTI] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [userFriends, setUserFriends] = useState([]);
  const [userFriendsAmount, setUserFriendsAmount] = useState([]);

  const [allUsers, setAllUsers] = useState([]);

  const [tempParams, setTempParams] = useState(false);

  const toProfile = async (id) => {
    navigate("/profile/" + id);
    window.location.reload();
  };


  useEffect(() => {

    if(Object.keys(params).length != 0) {
      setTempParams(true);
  
    const userId = params.userId;

    setUserId(userId);
    
    const fetchUserData = async () => {
      
      const userId = params.userId; 

      setIsLoading(true);

      try {
        const userInfo = await store.userInfo(userId);
        setUserName(userInfo.name);
        setUserSurname(userInfo.surname);
        setUserImage(userInfo.activeAvatar);
        setUserTypeMBTI(userInfo.typeMbti);
      } catch (error) {
          console.error("Failed to fetch user data:", error);
      } finally {
          setIsLoading(false);
      }
    };

    const fetchUserFriends = async () => {
      setIsLoading(true);
      const userId = params.userId; 
      

      try {
        const friends = await store.getFriendsFull(userId);
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
    fetchUserFriends();
  } else {

    const fetchUsers = async () => {
      setIsLoading(true);
      

      try {
        const users = await store.getAllUsers();
        setAllUsers(users);
      } catch (error) {
          console.error("Failed to fetch user data:", error);
      } finally {
          setIsLoading(false);
      }
    };

    fetchUsers();

  }
  }, [])

  useEffect(() => {
    const urlData = decodeURIComponent(location.search);

    const text = urlData.substr(6, urlData.indexOf("&mbti=") - 6);

    const mbti = Number(urlData.substr(urlData.indexOf("&mbti=") + 6));

    const fetchUsers = async () => {
      setIsLoading(true);
      

      try {
        const users = await store.getUsersFromName(text, mbti);
        setAllUsers(users);
      } catch (error) {
          console.error("Failed to fetch user data:", error);
      } finally {
          setIsLoading(false);
      }
    };

    fetchUsers();

  }, [location.search])

  return (
    <div className='friends__wrapper'>
      {tempParams && 
      <>
      <div className="friends__heading">
          <h1 className="friends__text">Друзья</h1>
          <img src={userImage ? userImage : Placeholder} alt=" " className="friends__avatar" onClick={(e) => toProfile(userId)}/>
      </div>
      <ul className="friends__list">
        {userFriends.map(friend =>
        <li key={friend.id} className="friends__item friend" onClick={(e) => toProfile(friend.id)}>
          <img className="friend__avatar" src={friend.picUrl ? friend.picUrl : Placeholder} alt=""></img>
          <h2 className="friend__name">{friend.name + " " + friend.surname}</h2>
          <p className="friend__mbti">{mbtiTypes[friend.mbti - 1]}</p>
        </li>
        )}
      </ul>
      </>
      }
      {!tempParams && 
        <>
        <div className="friends__heading">
          <h1 className="friends__text">Найти друзей</h1>
        </div>
        <ul className="friends__list">
          {allUsers.map(friend =>
          <li key={friend.id} className="friends__item friend" onClick={(e) => toProfile(friend.id)}>
            <img className="friend__avatar" src={friend.picUrl ? friend.picUrl : Placeholder} alt=" "></img>
            <h2 className="friend__name">{friend.name + " " + friend.surname}</h2>
            <p className="friend__mbti">{mbtiTypes[friend.mbti - 1]}</p>
          </li>
          )}
        </ul>
        </>
      }
    </div>
  );
};

export default Frineds;

