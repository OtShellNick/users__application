import React, {useContext, useEffect, useState} from "react";
import {Grid, Paper, Skeleton} from '@mui/material';
import * as CookieParser from '@helpers/cookie';

import './People.scss';
import {getAllUsers} from "@actions/users";
import moment from "moment";

import DefaultImg from '@assets/default.png';
import {UserContext} from "@/context/userContext";

const People = () => {
    const {user} = useContext(UserContext)
    const [users, setUsers] = useState([]);
    const auth = CookieParser.get('appSessionId');
    console.log('user', user)

    useEffect(() => {
        if(users.length === 0 && auth) getAllUsers().then(data => setUsers(data.users));
    }, [users, auth]);

    return <div className='users'>
        <Grid container spacing={2}>
            {users.length ? users.filter(u => u.email !== user.email).map((user, index) => <Grid key={user.name + index} item xs={2}>
                <Paper variant='elevation'>
                    <img className='user__photo' src={user.photo ? user.photo : DefaultImg} alt="logo"/>
                    <div className='user__content'>
                        <h2 className='user__content_name'>{`User name: ${user.name}`}</h2>
                        {user.birthday && <p>{`User years old: ${moment(user.birthday).fromNow(true)}`}</p>}
                    </div>
                </Paper>
            </Grid>) : <Grid item xs={2}>
                <Paper>
                    <Skeleton variant="rectangular" width='100%' height={118} />
                    <Skeleton width="60%" />
                </Paper>
            </Grid>}
        </Grid>
    </div>
}

export default People;