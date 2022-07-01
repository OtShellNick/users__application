import React, {useContext, useRef, useState} from "react";

import './FormUpdate.scss';
import {UserContext} from "@/context/userContext";
import {Formik} from "formik";
import {Button, createTheme, FormHelperText, MenuItem, TextField, ThemeProvider} from "@mui/material";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {toBase64} from "@helpers/fileConvert";
import * as yup from "yup";
import {userUpdate} from "@actions/users";
import moment from "moment";
import {checkAuth} from "@helpers/checkAuth";

const FormUpdate = () => {
    const {user, setUser} = useContext(UserContext);
    const fileInput = useRef(null);
    const [error, setError] = useState('');
    moment.locale('ru');

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

    if(user.name) return <Formik
        initialValues={{...user, newPassword: '', newPhoto: null}}
        validationSchema={yup.object().shape({
            name: yup.string().min(3, 'Name must be minimum 3 character'),
            email: yup.string().email('Enter a valid email'),
            newPassword: yup.string(),
            birthday: yup.string().nullable(),
            gender: yup.string(),
            newPhoto: yup.string().nullable()
        })}
        onSubmit={async (values, { setSubmitting }) => {
            if(!values.newPassword) delete values.newPassword;
            if(!values.newPhoto) delete values.newPhoto;

            try {
                setSubmitting(true);
                setError('');
                const {user} = await userUpdate(values);

                setUser(user);
            } catch (e) {
                checkAuth(e);
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
                        fullWidth
                        style={{display: 'none'}}
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
                        fullWidth
                        id="outlined-required"
                        color='neutral'
                        type='password'
                        name="newPassword"
                        label="New Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        defaultValue={values.password}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                    />

                    <TextField
                        size="small"
                        fullWidth
                        select
                        id="outlined-required"
                        color='neutral'
                        name="gender"
                        label="Gender"
                        style={{display: 'none'}}
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
                                        setFieldValue('newPhoto', result)
                                    } catch (error) {
                                        console.error(error);
                                    }

                                }
                            }}
                        />
                    </Button>
                </ThemeProvider>
                {error && <FormHelperText error>{error}</FormHelperText>}
                <Button color="error" variant="outlined" type="submit" disabled={isSubmitting}>Update</Button>
            </form>
        }}
    </Formik>
}

export default FormUpdate;