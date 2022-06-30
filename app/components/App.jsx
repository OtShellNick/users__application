import React, {lazy, useEffect} from "react";
import {
    Routes, Route, useLocation, useNavigate
} from 'react-router-dom';
import * as CookieHelper from '@helpers/cookie';

import '@style/main.scss';

import Layout from "@components/Layout/Layout";

const Login = lazy(() => import('@components/Login/Login'));
const Account = lazy(() => import('@components/Account/Account'));
const People = lazy(() => import('@components/People/People'));

const App = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = CookieHelper.get('appSessionId');

    useEffect(() => {
        if(location.pathname === '/login' && auth) navigate('/');
        if(!auth && location.pathname !== '/login') navigate('/login');
    }, [location, auth]);

    return <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<People/>}/>
                <Route path='account' element={<Account/>}/>
            </Route>
            <Route path='/login' element={<Login/>}/>

        </Routes>
}

export default App;