import React, {useEffect, useState} from "react";
import moment from "moment";
import {Skeleton} from "@mui/material";

import {getUserPhoto} from "@actions/users";

import './UserCard.scss';



const UserCard = ({user}) => {
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        if(!photo && user.photo) getUserPhoto(user.photo).then(data => setPhoto(data.photo));
    });

    return <div className='card'>
        {!photo && <Skeleton className='card__photo' variant="rectangular" width={255} height={118} />}
        {photo && <img className='card__photo' src={photo} alt="user photo"/>}
        <div className='card__content'>
            <h2 className='card__heading'>{user.name}</h2>
            <span>{user.gender.split('').map((letter, index) => index === 0 ? letter.toUpperCase() : letter).join('')}</span>{user.birthday && <span className='card__text'>{", " + moment(user.birthday).fromNow(true)}</span>}
        </div>
    </div>
}

export default UserCard;