import React from "react";
import LoginForm from "./Components/Auth/Login/LoginForm";
import RegisterForm from "./Components/Auth/Register/RegisterForm";
import Test from "./Components/Auth/Test/Test";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import Friends from "./Components/Friends/Friends";
import Settings from "./Components/Settings/Settings";
import About from "./Components/About/About";
import Chats from "./Components/Chat/Chats";
import Wiki from "./Components/Wiki/Wiki";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Messages from "./Components/Messages/Messages";
import WikiCreate from "./Components/Wiki/WikiCreate";
import WikiArticle from "./Components/Wiki/WikiArticle";
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginForm />}/>
          <Route path="register" element={<RegisterForm />}/>
          <Route path="test" element={<Test />}/>
          <Route path="/" element={<Home />}>
          <Route path="profile/:userId" element={<Profile />}/>
          <Route path="profile/:userId/friends" element={<Friends />}/>
          <Route path="friends" element={<Friends />}/>
          <Route path="about" element={<About />}/>
          {/* <Route path="messages" element={<Messages />}/> */}
          <Route path="messages" element={<Chats/>}/>
          <Route path="wiki" element={<Wiki />}/>
          <Route path="wiki/:wikiId" element={<WikiArticle />}/>
          <Route path="wiki/create" element={<WikiCreate/>}/>
          <Route path="settings" element={<Settings />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
