import React, {createContext, useEffect, useState} from "react";
import {getSelf} from "@actions/users";
export const UserContext = createContext({});
const UserProvider = ({children}) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        if(!user.name) getSelf().then(res => setUser(res.user));
    }, [user]);

    return <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>
}

export default UserProvider;