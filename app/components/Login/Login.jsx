import React, {useState} from "react";
import { Button } from '@mui/material';

import LoginIcon from '@assets/lock.svg?jsx';

import RegisterForm from "@components/Login/RegisterForm/RegisterForm";
import LoginForm from "@components/Login/LoginForm/LoginForm";

import './Login.scss';

const Login = () => {
    const [isLogin, setIsLogin] = useState(false);
    return <div className='login'>
        <div className='login__form-wrapper'>
            <div className='login__form-wrapper_heading'>
                <LoginIcon/>
                <h2>{isLogin ? 'Register' : 'Login'}</h2>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setIsLogin((prevState) => !prevState)}
                    // color="inherit"
                >
                    {isLogin ? 'Login' : 'Register'}
                </Button>
            </div>
            {isLogin && <RegisterForm/>}
            {!isLogin && <LoginForm/>}
        </div>
    </div>
}

export default Login;