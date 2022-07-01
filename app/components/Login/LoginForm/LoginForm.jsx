import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Formik} from "formik";
import * as yup from "yup";
import {Button, createTheme, TextField, ThemeProvider, FormHelperText} from "@mui/material";
import * as CookieHelper from '@helpers/cookie';

import {login} from "@actions/users";

import './LoginForm.scss';

const LoginForm = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const theme = createTheme({
        status: {
            danger: '#e53e3e',
        },
        palette: {
            primary: {
                main: '#0971f1',
                darker: '#053e85',
            },
            neutral: {
                main: '#563838',
                contrastText: '#fff',
                text: '#DCD9C6'
            },
        },
    });

    return <Formik
        initialValues={{
            email: '',
            password: '',
        }}
        validationSchema={yup.object().shape({
            email: yup.string().email('Enter a valid email').required('Email is required'),
            password: yup.string().required('Password is required'),
        })}
        onSubmit={async (values, {setSubmitting}) => {
            setSubmitting(true);

            try {

                const {appSessionId} = await login(values);

                CookieHelper.set('appSessionId', appSessionId);
                navigate('/');

            } catch (e) {

                const {response} = e;
                if (response.data) setError(response.data.error);

            } finally {
                setSubmitting(false);
            }
        }}>
        {({
              values,
              errors,
              touched,
              isSubmitting,
              handleSubmit,
              handleBlur,
              handleChange,
          }) => {
            return <form className='form' onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    <TextField
                        size="small"
                        required
                        fullWidth
                        id="outlined-required"
                        color='neutral'
                        type='email'
                        name="email"
                        label="Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        defaultValue={values.email}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    />

                    <TextField
                        size="small"
                        required
                        fullWidth
                        id="outlined-required"
                        color='neutral'
                        type='password'
                        name="password"
                        label="Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        defaultValue={values.password}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                    />
                </ThemeProvider>
                {error && <FormHelperText error>{error}</FormHelperText>}
                <Button color="error" fullWidth variant="outlined" type="submit" disabled={isSubmitting}>Login</Button>
            </form>
        }}
    </Formik>
}

export default LoginForm;