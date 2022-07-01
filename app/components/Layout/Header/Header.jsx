import React, {useContext, useEffect, useState} from "react";
import {Button, Skeleton} from "@mui/material";
import * as CookieHelper from '@helpers/cookie';
import {useNavigate, Link, useLocation} from "react-router-dom";

import {getUserPhoto, logout} from "@actions/users";
import {UserContext} from "@/context/userContext";

import './Header.scss';

const Header = () => {
    const {user} = useContext(UserContext);
    const jwt = CookieHelper.get('appSessionId');
    const [photo, setPhoto] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if(user.photo) getUserPhoto(user.photo).then(data => setPhoto(data.photo));
    }, [photo, user]);

    return <div className='header'>
        <ul className='header__list'>
            <li className='header__list__item'>
                {!photo && <Skeleton variant="circular" width={40} height={40} />}
                {photo && <img className='header__ava' src={photo} alt="avatar"/>}
            </li>
            <li className='header__list__item'>
                <Link className={'header__list__item__link' + (location.pathname === '/account' ? ' header__list__item__link-active' : '')} to='/account'>Account</Link>
            </li>
            <li className='header__list__item'>
                <Link className={'header__list__item__link' + (location.pathname === '/' ? ' header__list__item__link-active' : '')} to='/'>Users</Link>
            </li>
            <li className='header__list__item'>
                <Button
                    size='small'
                    color="error"
                    fullWidth
                    variant="outlined"
                    onClick={async () => {
                        try {
                            await logout(jwt);
                            CookieHelper.del('appSessionId');
                            navigate('/login', {replace: true});
                        } catch (e) {
                            console.log('logout error', e)
                        }
                    }}>
                    Logout
                </Button>
            </li>
        </ul>
    </div>
}

export default Header;