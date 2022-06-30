import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Formik} from 'formik';
import * as yup from 'yup';
import {Button, TextField, MenuItem, createTheme, ThemeProvider, FormHelperText} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import * as CookieHelper from '@helpers/cookie';
import { toBase64 } from "@helpers/fileConvert";

import {signup} from "@actions/users";

import './RegisterForm.scss';

const RegisterForm = () => {
    moment.locale('ru');
    const fileInput = useRef();
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
            name: '',
            email: '',
            password: '',
            repeatPassword: '',
            birthday: null,
            gender: 'male',
            photo: null
        }}
        validationSchema={yup.object().shape({
            name: yup.string().min(3, 'Name must be minimum 3 character').required('Name is Required'),
            email: yup.string().email('Enter a valid email').required('Email is required'),
            password: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required'),
            repeatPassword: yup.string().required('Password is required'),
            birthday: yup.string().nullable(),
            gender: yup.string(),
            photo: yup.string().nullable()
        })}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
            setSubmitting(true);
            setError('');
            if(values.password !== values.repeatPassword) setFieldError('repeatPassword', 'Password must be equal');

            delete values.repeatPassword;

            try {

                const {appSessionId} = await signup(values);
                CookieHelper.set('appSessionId', appSessionId);
                navigate('/', {replace: true});

            } catch (e) {

                const {response} = e;
                if(response.data) setError(response.data.error);

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
              setFieldValue
          }) => {
            return <form className='form' onSubmit={handleSubmit}>
                    <ThemeProvider theme={theme}>

                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="outlined-required"
                            color='neutral'
                            name="name"
                            label="Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            defaultValue={values.name}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                        />

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

                        <TextField
                            size="small"
                            required
                            fullWidth
                            id="outlined-required"
                            color='neutral'
                            type='password'
                            name="repeatPassword"
                            label="Repeat Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            defaultValue={values.repeatPassword}
                            error={touched.repeatPassword && Boolean(errors.repeatPassword)}
                            helperText={touched.repeatPassword && errors.repeatPassword}
                        />

                        <TextField
                            size="small"
                            fullWidth
                            select
                            id="outlined-required"
                            color='neutral'
                            name="gender"
                            label="Gender"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.gender}
                            error={touched.gender && Boolean(errors.gender)}
                            helperText={touched.gender && errors.gender}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </TextField>

                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker
                                label="Birthday"
                                disableFuture
                                inputFormat="DD.MM.YYYY"
                                value={values.birthday}
                                onChange={(value) => setFieldValue('birthday', new Date(value.toDate()))}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                if (fileInput && fileInput.current) fileInput.current.click();
                            }}
                        >
                            Upload Photo
                            <input
                                ref={fileInput}
                                type="file"
                                hidden
                                onChange={async (event) => {
                                    if (event.target.files) {
                                        try {
                                            const result = await toBase64(event.target.files[0]);
                                            setFieldValue('photo', result)
                                        } catch(error) {
                                            console.error(error);
                                        }

                                    }
                                }}
                            />
                        </Button>
                    </ThemeProvider>
                {error && <FormHelperText error>{error}</FormHelperText>}
                <Button color="error" variant="outlined" type="submit" disabled={isSubmitting}>Register</Button>
            </form>
        }}
    </Formik>
}

export default RegisterForm;