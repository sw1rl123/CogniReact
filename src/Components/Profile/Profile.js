import React, { useContext, useEffect, useRef, useState } from 'react';
import './Profile.css';
import { ReactComponent as CloseSvg } from './img/close.svg';
import { ReactComponent as StarSvg } from './img/star.svg';
import { Context } from '../..';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Placeholder from './img/placeholder.png';

function Profile() {
  const fixedHobbyNames = ['Музыка', 'Медиа', 'Творчество', 'Игры', 'Спорт'];

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
  const [tagCatalog, setTagCatalog] = useState([]);
  const [tagSelection, setTagSelection] = useState({ categoryIds: [], tagIds: [] });
  const [viewerTagSelection, setViewerTagSelection] = useState({ categoryIds: [], tagIds: [] });
  const [tagDraft, setTagDraft] = useState({ categoryIds: [], tagIds: [] });
  const [tagPage, setTagPage] = useState(0);
  const [activeHobbyId, setActiveHobbyId] = useState(null);
  const [activeTagCategory, setActiveTagCategory] = useState(null);
  const [tagSearch, setTagSearch] = useState('');
  const [isTagsLoading, setIsTagsLoading] = useState(false);
  const [isTagsSaving, setIsTagsSaving] = useState(false);
  const [tagError, setTagError] = useState('');

  const [isFrinedsText, setIsFrinedsText] = useState('добавить в друзья');
  const [isFrineds, setIsFrineds] = useState(false);
  const selectedProfileCategories = tagCatalog
    .flatMap(hobby => hobby.categories || [])
    .filter(category => tagSelection.categoryIds.includes(category.id))
    .sort((first, second) => tagSelection.categoryIds.indexOf(first.id) - tagSelection.categoryIds.indexOf(second.id));
  const selectedProfileTags = tagCatalog
    .flatMap(hobby => hobby.categories || [])
    .flatMap(category => category.tags || [])
    .filter(tag => tagSelection.tagIds.includes(tag.id))
    .sort((first, second) => tagSelection.tagIds.indexOf(first.id) - tagSelection.tagIds.indexOf(second.id));
  const activeHobbyCategories = tagCatalog
    .find(hobby => hobby.id === activeHobbyId)?.categories || [];
  const fixedHobbies = fixedHobbyNames
    .map(name => tagCatalog.find(hobby => hobby.name === name))
    .filter(Boolean);
  const activeHobbySelectedDraftCategories = activeHobbyCategories
    .filter(category => tagDraft.categoryIds.includes(category.id));
  const activeTagCategoryDraft = activeHobbySelectedDraftCategories
    .find(category => category.id === activeTagCategory);
  const activeHobbySelectedCategories = activeHobbyCategories
    .filter(category => tagSelection.categoryIds.includes(category.id));
  const activeHobbySelectedTags = activeHobbyCategories
    .flatMap(category => category.tags || [])
    .filter(tag => tagSelection.tagIds.includes(tag.id));
  const visibleTagCategories = activeHobbyCategories
    .filter(category => category.name.toLowerCase().includes(tagSearch.toLowerCase()))
    .sort((first, second) => first.name.localeCompare(second.name, 'ru'));
  const tagCategoryGroups = visibleTagCategories.reduce((groups, category) => {
    const firstCharacter = category.name.charAt(0);
    const group = /^\d/.test(firstCharacter) ? '0—9' : firstCharacter.toLocaleUpperCase('ru-RU');
    groups[group] = [...(groups[group] || []), category];
    return groups;
  }, {});
  const tagCategoryGroupNames = Object.keys(tagCategoryGroups);
  const visibleTagTags = (activeTagCategoryDraft?.tags || [])
    .filter(tag => tag.nameTag?.toLowerCase().includes(tagSearch.toLowerCase()))
    .sort((first, second) => first.nameTag.localeCompare(second.nameTag, 'ru'));
  const tagTagGroups = visibleTagTags.reduce((groups, tag) => {
    const firstCharacter = tag.nameTag.charAt(0);
    const group = /^\d/.test(firstCharacter) ? '0—9' : firstCharacter.toLocaleUpperCase('ru-RU');
    groups[group] = [...(groups[group] || []), tag];
    return groups;
  }, {});
  const tagTagGroupNames = Object.keys(tagTagGroups);

  const selectActiveHobby = (hobbyId) => {
    setActiveHobbyId(hobbyId);
    const hobby = tagCatalog.find(item => item.id === hobbyId);
    const nextCategory = hobby?.categories?.find(category => tagDraft.categoryIds.includes(category.id));
    setActiveTagCategory(nextCategory?.id || null);
    setTagSearch('');
  };

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

  useEffect(() => {
    if (!params.userId) return;

    let isCurrent = true;
    const viewerId = localStorage.getItem('userId');
    Promise.all([
      store.getUserTagSelection(params.userId),
      viewerId ? store.getUserTagSelection(viewerId) : Promise.resolve(null),
      store.getTagCatalog()
    ])
      .then(([selection, viewerSelection, catalog]) => {
        if (isCurrent) {
          setTagCatalog(catalog);
          setTagSelection({
            categoryIds: selection.categoryIds || [],
            tagIds: selection.tagIds || []
          });
          if (viewerSelection) {
            setViewerTagSelection({
              categoryIds: viewerSelection.categoryIds || [],
              tagIds: viewerSelection.tagIds || []
            });
          }
        }
      })
      .catch(error => console.error('Failed to fetch profile tags:', error));

    return () => {
      isCurrent = false;
    };
  }, [params.userId, store]);

  const [isModalShow, setIsModalShow] = useState(false);

  const showModel = () => {
    setIsModalShow(true);
  }

  const hideModel = () => {
    setIsModalShow(false);
    setValidText(false); 
  }

  const [isTagsShow, setIsTagsShow] = useState(false);

  const showTags = async () => {
    setIsTagsShow(true);
    setIsTagsLoading(true);
    setTagError('');
    setTagPage(0);
    setTagSearch('');
    try {
      const [catalog, selection] = await Promise.all([
        store.getTagCatalog(),
        store.getUserTagSelection(userId)
      ]);
      setTagCatalog(catalog);
      const normalizedSelection = {
        categoryIds: selection.categoryIds || [],
        tagIds: selection.tagIds || []
      };
      setTagSelection(normalizedSelection);
      setTagDraft(normalizedSelection);
      setActiveHobbyId(
        catalog.find(hobby => hobby.name === fixedHobbyNames[0])?.id ||
        null
      );
      const firstHobbyCategories = catalog.find(hobby => hobby.name === fixedHobbyNames[0])?.categories || [];
      setActiveTagCategory(
        firstHobbyCategories.find(category => (selection.categoryIds || []).includes(category.id))?.id ||
        firstHobbyCategories[0]?.id ||
        null
      );
    } catch (error) {
      console.error('Failed to load tags:', error);
      setTagError('Не удалось загрузить теги. Попробуйте еще раз.');
    } finally {
      setIsTagsLoading(false);
    }
  }

  const hideTags = () => {
    setIsTagsShow(false);
    setTagPage(0);
    setTagError('');
  }

  const startTagEditing = () => {
    setTagDraft({
      categoryIds: [...tagSelection.categoryIds],
      tagIds: [...tagSelection.tagIds]
    });
    setTagPage(1);
    setTagError('');
  };

  const toggleTagCategory = (categoryId) => {
    setTagDraft(current => {
      const selected = current.categoryIds.includes(categoryId);
      const categoryTagIds = activeHobbyCategories
        .find(category => category.id === categoryId)?.tags.map(tag => tag.id) || [];
      return {
        ...current,
        categoryIds: selected
          ? current.categoryIds.filter(id => id !== categoryId)
          : [...current.categoryIds, categoryId],
        tagIds: selected
          ? current.tagIds.filter(id => !categoryTagIds.includes(id))
          : current.tagIds
      };
    });
    if (activeTagCategory === categoryId) {
      const nextCategory = activeHobbyCategories.find(category =>
        category.id !== categoryId && tagDraft.categoryIds.includes(category.id));
      setActiveTagCategory(nextCategory?.id || null);
    }
  };

  const toggleProfileTag = (tagId) => {
    setTagDraft(current => ({
      ...current,
      tagIds: current.tagIds.includes(tagId)
        ? current.tagIds.filter(id => id !== tagId)
        : [...current.tagIds, tagId]
    }));
  };

  const saveTagSelection = async () => {
    setIsTagsSaving(true);
    setTagError('');
    try {
      const selectionToSave = { ...tagDraft };
      await store.setUserTagSelection(selectionToSave);
      setTagSelection(selectionToSave);
      setTagDraft(selectionToSave);
      if (String(userId) === String(currentUserId)) {
        setViewerTagSelection(tagDraft);
      }
      setTagPage(0);
    } catch (error) {
      console.error('Failed to save tags:', error);
      setTagError('Не удалось сохранить изменения. Попробуйте еще раз.');
    } finally {
      setIsTagsSaving(false);
    }
  };

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
        <div className="modal--bg modal--bg-tags">
          <section className="profile__tags tags" aria-label="Теги профиля">
            <ul className="tags__bookmarks" aria-label="Закладки увлечений">
              {fixedHobbies.map(hobby => (
                <li className="tags__bookmark" key={hobby.id}>
                  <button
                    type="button"
                    className={hobby.id === activeHobbyId ? 'tags__bookmark-button tags__bookmark-button--active' : 'tags__bookmark-button'}
                    onClick={() => selectActiveHobby(hobby.id)}
                    aria-label={`Закладка: ${hobby.name}`}
                    aria-pressed={hobby.id === activeHobbyId}
                    title={hobby.name}
                  >
                    <StarSvg />
                  </button>
                </li>
              ))}
            </ul>
            <div className="tags__wrapper">
              <h2 className="tags__heading">
                {(tagCatalog.find(hobby => hobby.id === activeHobbyId)?.name || 'УВЛЕЧЕНИЯ').toLocaleUpperCase('ru-RU')}
              </h2>
              <button onClick={hideTags} type="button" className='modal__button--close'><CloseSvg className='modal__icon'/></button>
              {tagError && <p className="tags__error" role="alert">{tagError}</p>}
              {isTagsLoading ? <p className="tags__message">Загружаем категории и теги...</p> : <>
                {tagPage > 0 && (
                  <ol className="tags__steps" aria-label="Шаги редактирования">
                    {['Выбранное', 'Категории', 'Теги'].map((step, index) => (
                      <li key={step}>
                        <button
                          type="button"
                          className={`tags__step${tagPage === index + 1 ? ' tags__step--active' : ''}${tagPage > index + 1 ? ' tags__step--completed' : ''}`}
                          onClick={() => {
                            setTagPage(index + 1);
                            setTagSearch('');
                            if (index === 2 && !activeHobbySelectedDraftCategories.some(category => category.id === activeTagCategory)) {
                              setActiveTagCategory(activeHobbySelectedDraftCategories[0]?.id || null);
                            }
                          }}
                          aria-current={tagPage === index + 1 ? 'step' : undefined}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}

                {tagPage === 0 && (
                  <div className="tags__view-content" aria-label="Выбранные жанры и хештеги">
                    <ul className="tags__pill-list">
                      {activeHobbySelectedCategories.map(category => (
                        <li className="tags__pill-item" key={category.id}>
                          <span className="tags__pill tags__pill--display">{category.name}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="tags__list">
                      {activeHobbySelectedTags.map(tag => (
                        <li
                          className={`tags__item${String(userId) !== String(currentUserId) && viewerTagSelection.tagIds.includes(tag.id) ? ' tags__item--matched' : ''}`}
                          key={tag.id}
                        >
                          #{tag.nameTag}
                        </li>
                      ))}
                    </ul>
                    {activeHobbySelectedCategories.length === 0 && activeHobbySelectedTags.length === 0 && (
                      <p className="tags__message">Пока ничего не выбрано.</p>
                    )}
                  </div>
                )}

                {tagPage === 1 && <>
                  <div className="tags__selection-editor">
                    <p className="categories__heading">мои категории:</p>
                    <ul className="tags__pill-list tags__selected-pills">
                      {activeHobbySelectedDraftCategories.map(category => (
                        <li className="tags__pill-item" key={category.id}>
                          <button
                            className="tags__pill tags__pill--selected"
                            type="button"
                            onClick={() => toggleTagCategory(category.id)}
                            aria-label={`Удалить категорию ${category.name}`}
                          >
                            <span>{category.name}</span>
                            <span className="tags__pill-action" aria-hidden="true">×</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p className="categories__heading">мои теги:</p>
                    <ul className="tags__selected-hashtags">
                      {activeHobbySelectedDraftCategories
                        .flatMap(category => category.tags || [])
                        .filter(tag => tagDraft.tagIds.includes(tag.id))
                        .sort((first, second) => first.nameTag.localeCompare(second.nameTag, 'ru'))
                        .map(tag => (
                          <li className="tags__selected-hashtag" key={tag.id}>
                            <span>#{tag.nameTag}</span>
                            <button
                              type="button"
                              className="tags__remove"
                              onClick={() => toggleProfileTag(tag.id)}
                              aria-label={`Удалить тег ${tag.nameTag}`}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </>}

                {tagPage === 2 && <>
                  <p className="categories__heading">добавить категории:</p>
                  <input
                    className="tags__search"
                    type="search"
                    value={tagSearch}
                    onChange={event => setTagSearch(event.target.value)}
                    placeholder="найти категорию"
                    aria-label="Поиск категорий"
                  />
                  <div className="tags__alphabet-layout">
                    <div className="tags__choice-list" aria-label="Категории по алфавиту">
                      {tagCategoryGroupNames.length === 0 && <p className="tags__message">Ничего не найдено.</p>}
                      {tagCategoryGroupNames.map(groupName => (
                        <section className="tags__letter-group" id={`tag-category-group-${groupName}`} key={groupName}>
                          <h3 className="tags__letter-heading">{groupName}</h3>
                          <ul className="tags__pill-list">
                            {tagCategoryGroups[groupName].map(category => {
                              const isSelected = tagDraft.categoryIds.includes(category.id);
                              return (
                                <li className="tags__pill-item" key={category.id}>
                                  <button
                                    className={`tags__pill${isSelected ? ' tags__pill--selected' : ''}${String(userId) !== String(currentUserId) && viewerTagSelection.categoryIds.includes(category.id) ? ' tags__pill--matched' : ''}`}
                                    type="button"
                                    onClick={() => toggleTagCategory(category.id)}
                                    aria-pressed={isSelected}
                                  >
                                    <span>{category.name}</span>
                                    <span className="tags__pill-action" aria-hidden="true">{isSelected ? '×' : '+'}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      ))}
                    </div>
                    {tagCategoryGroupNames.length > 1 && (
                      <nav className="tags__alphabet-index" aria-label="Переход к букве">
                        {tagCategoryGroupNames.map(groupName => (
                          <button
                            type="button"
                            key={groupName}
                            onClick={() => document.getElementById(`tag-category-group-${groupName}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })}
                            aria-label={`Перейти к разделу ${groupName}`}
                          >
                            {groupName === '0—9' ? '0' : groupName}
                          </button>
                        ))}
                      </nav>
                    )}
                  </div>
                </>}

                {tagPage === 3 && <>
                  <p className="categories__heading">добавить теги:</p>
                  <div className="tags__category-tabs">
                    {activeHobbySelectedDraftCategories.map(category => (
                      <button
                        type="button"
                        key={category.id}
                        className={activeTagCategory === category.id ? 'tags__category-tab tags__category-tab--active' : 'tags__category-tab'}
                        onClick={() => { setActiveTagCategory(category.id); setTagSearch(''); }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  <input
                    className="tags__search"
                    type="search"
                    value={tagSearch}
                    onChange={event => setTagSearch(event.target.value)}
                    placeholder="Поиск тегов"
                    aria-label="Поиск тегов"
                  />
                  <div className="tags__alphabet-layout">
                    <div className="tags__choice-list" aria-label="Теги по алфавиту">
                      {tagTagGroupNames.length === 0 && <p className="tags__message">Ничего не найдено.</p>}
                      {tagTagGroupNames.map(groupName => (
                        <section className="tags__letter-group" id={`tag-hashtag-group-${groupName}`} key={groupName}>
                          <h3 className="tags__letter-heading">{groupName}</h3>
                          <ul className="tags__pill-list">
                            {tagTagGroups[groupName].map(tag => {
                              const isSelected = tagDraft.tagIds.includes(tag.id);
                              return (
                                <li className="tags__pill-item" key={tag.id}>
                                  <button
                                    className={`tags__pill${isSelected ? ' tags__pill--selected' : ''}`}
                                    type="button"
                                    onClick={() => toggleProfileTag(tag.id)}
                                    aria-pressed={isSelected}
                                  >
                                    <span>#{tag.nameTag}</span>
                                    <span className="tags__pill-action" aria-hidden="true">{isSelected ? '×' : '+'}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      ))}
                    </div>
                    {tagTagGroupNames.length > 1 && (
                      <nav className="tags__alphabet-index" aria-label="Переход к букве">
                        {tagTagGroupNames.map(groupName => (
                          <button
                            type="button"
                            key={groupName}
                            onClick={() => document.getElementById(`tag-hashtag-group-${groupName}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })}
                            aria-label={`Перейти к разделу ${groupName}`}
                          >
                            {groupName === '0—9' ? '0' : groupName}
                          </button>
                        ))}
                      </nav>
                    )}
                  </div>
                </>}
              </>}
              {userId == currentUserId && tagPage === 0 && !isTagsLoading && (
                <button className="tags__button" type="button" onClick={startTagEditing}>редактировать</button>
              )}
              {userId == currentUserId && tagPage > 0 && !isTagsLoading && (
                <button className="tags__button" type="button" disabled={isTagsSaving} onClick={saveTagSelection}>
                  {isTagsSaving ? 'сохраняем...' : 'сохранить'}
                </button>
              )}
            </div>
          </section>
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
            {selectedProfileCategories.slice(0, Math.max(0, 6 - selectedProfileTags.length))
              .map(category => <li key={`category-${category.id}`} className='hobbies__button'>#{category.name}</li>)}
            {selectedProfileTags.slice(0, 6)
              .map(tag => <li key={tag.id} className='hobbies__button'>#{tag.nameTag}</li>)}
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
