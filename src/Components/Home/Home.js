import Profile from "../Profile/Profile";
import Friends from "../Friends/Friends";
import Header from "../Layouts/Header/Header";
import Navigation from "../Layouts/Navigation/Navigation";
import Settings from "../Settings/Settings";
import About from "../About/About";
import Chats from "../Chat/Chats";
import React, { useEffect, useRef, useState} from "react";
import {Context} from "../../index";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {observer} from "mobx-react-lite";
import './Home.css';
import Wiki from "../Wiki/Wiki";
import Messages from "../Messages/Messages";
import WikiCreate from "../Wiki/WikiCreate";
import WikiArticle from "../Wiki/WikiArticle";
import { CHAT_API_URL } from "../../services/globals";
import * as signalR from "@microsoft/signalr";

function Home() {
    const navigate = useNavigate();
    let params = useParams();
    const location = useLocation();

    useEffect(() => {
        localStorage.removeItem('name');
        localStorage.removeItem('surname');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('mbtiType');

        if (!(localStorage.getItem('userId') && (localStorage.getItem('aToken') || localStorage.getItem('rToken')))) {
            navigate('/login');
            window.location.reload();
        }
        if (location.pathname == "/") {
            navigate('/profile/' + localStorage.getItem('userId'));
            window.location.reload();
        }
    }, []);

    return (
        <div className="home">
            <Header></Header>
            <div className="home__bg">
            <div className="home__wrapper">
                <Navigation></Navigation>
                {location.pathname === '/profile/' + params.userId && <Profile />}
                {location.pathname === '/profile/' + params.userId + '/friends' && <Friends />}
                {location.pathname === '/friends' && <Friends />}
                {location.pathname === "/settings" && <Settings />}
                {location.pathname === "/about" && <About />}
                {location.pathname === "/messages" && <Chats />}
                {location.pathname === "/wiki" && <Wiki/>}
                {location.pathname === '/wiki/' + params.wikiId && <WikiArticle/>}
                {location.pathname === "/wiki/create" && <WikiCreate/>}
            </div>
            </div>
        </div>
    );
};

export default observer(Home);

