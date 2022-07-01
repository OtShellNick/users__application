import React, {createContext, useEffect, useState} from "react";
import {getSelf} from "@actions/users";
import {checkAuth} from "@helpers/checkAuth";
export const UserContext = createContext({});
const UserProvider = ({children}) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        if(!user.name) getSelf().then(res => setUser(res.user)).catch(checkAuth);
    }, [user]);

    return <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>
}

export default UserProvider;