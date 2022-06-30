import React, {useContext} from "react";
import {Button} from "@mui/material";
import * as CookieHelper from '@helpers/cookie';
import {useNavigate, Link} from "react-router-dom";

import {logout} from "@actions/users";
import {UserContext} from "@/context/userContext";

import DefaultIcon from '@assets/default.png';

import './Header.scss';

const Header = () => {
    const {user} = useContext(UserContext);
    const jwt = CookieHelper.get('appSessionId');
    const navigate = useNavigate();

    return <div className='header'>
        <ul className='header__list'>
            <li className='header__list__item'>
                <img className='header__ava' src={user.photo || DefaultIcon} alt="avatar"/>
            </li>
            <li className='header__list__item'>
                <Link to='/account'>Account</Link>
            </li>
            <li className='header__list__item'>
                <Link to='/'>Users</Link>
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