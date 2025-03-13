import Profile from "../Profile/Profile";
import Friends from "../Friends/Friends";
import Header from "../Layouts/Header/Header";
import Navigation from "../Layouts/Navigation/Navigation";
import Settings from "../Settings/Settings";
import About from "../About/About";
import React, { useEffect, useContext} from "react";
import {Context} from "../../index";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {observer} from "mobx-react-lite";
import './Home.css';
import Wiki from "../Wiki/Wiki";

function Home() {
    const location = useLocation();

    let params = useParams()

    const navigate = useNavigate();

    useEffect(() => {
        
        localStorage.removeItem('name');
        localStorage.removeItem('surname');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('mbtiType');

        if (!(localStorage.getItem('userId') && (localStorage.getItem('aToken') || localStorage.getItem('rToken')))) {
            navigate('/login');
        }
        if (location.pathname == "/") {
            navigate('/profile/' + localStorage.getItem('userId'));
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
                {location.pathname === "/wiki" && <Wiki/>}
            </div>
            </div>
        </div>
    );
};

export default observer(Home);

