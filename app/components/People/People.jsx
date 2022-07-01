import React, {useContext, useEffect, useState} from "react";
import {Paper, Skeleton} from '@mui/material';
import * as CookieParser from '@helpers/cookie';
import moment from "moment";
import {UserContext} from "@/context/userContext";
import {checkAuth} from "@helpers/checkAuth";

import {getAllUsers} from "@actions/users";

import UserCard from "@components/People/UserCard/UserCard";

import './People.scss';

const People = () => {
    const {user} = useContext(UserContext)
    const [users, setUsers] = useState([]);
    const auth = CookieParser.get('appSessionId');
    moment.locale('ru');

    useEffect(() => {
        if(users.length === 0 && auth) getAllUsers().then(data => setUsers(data.users)).catch(checkAuth);
    }, [users, auth]);

    return <div className='users'>
        {users.length ? users.filter(u => u.email !== user.email).map((user, index) => <UserCard key={user.name + index} user={user}/>) : <Paper>
                <Skeleton variant="rectangular" width='100%' height={118} />
                <Skeleton width="60%" />
            </Paper>}
    </div>
}

export default People;