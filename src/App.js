import React from "react";
import LoginForm from "./Components/Auth/Login/LoginForm";
import RegisterForm from "./Components/Auth/Register/RegisterForm";
import Test from "./Components/Auth/Test/Test";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import Settings from "./Components/Settings/Settings";
import About from "./Components/About/About";
import Wiki from "./Components/Wiki/Wiki";
import { BrowserRouter, Route, Routes, Item } from 'react-router-dom';
import './App.css';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginForm />}/>
          <Route path="register" element={<RegisterForm />}/>
          <Route path="test" element={<Test />}/>
          <Route path="/" element={<Home />}>
          <Route exact path="profile" element={<Profile />}/>
          <Route path="about" element={<About />}/>
          <Route path="wiki" element={<Wiki />}/>
          <Route path="settings" element={<Settings />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
