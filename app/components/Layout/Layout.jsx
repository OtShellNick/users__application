import React, {Suspense} from "react";
import { Outlet } from 'react-router-dom';

import Header from "@components/Layout/Header/Header";
import Preloader from "@components/Preloader/Preloader";

import './Layout.scss';
import UserProvider from "@/context/userContext";

const Layout = () => {
    return <UserProvider>
    <div className='layout'>
        <Header/>
        <Suspense fallback={<Preloader/>}>
            <Outlet/>
        </Suspense>
    </div>
    </UserProvider>
}

export default Layout;