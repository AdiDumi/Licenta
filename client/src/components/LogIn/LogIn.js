import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {Container, Avatar, Typography, Button, TextField, Box, CssBaseline} from '@mui/material';

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const validationSchema = yup.object({
    username: yup
        .string('Enter your username')
        .required('Username is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
});

export default function LogIn({setToken}) {
    const navigate = useNavigate();
    const [loginError, setLoginError] = React.useState("");

    const formik = useFormik({
        initialValues: {
            username: 'admin@grow.app',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: values => {
                axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/login',
                    {},
                    {
                        auth: {
                            username: values.username,
                            password: values.password
                        }
                    })
                    .then(response => {
                        setToken(response.data);
                        navigate("/dashboard");
                    })
                    .catch((error) => {
                        setLoginError(error.response.data.error.lde_message);
                    });
        },
    })


    return (
        <Box m="auto" sx={{
            backgroundColor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'fit-content',
            height: 'fit-content',
            alignItems: 'center',
        }}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography sx={{fontFamily: 'sans-serif',  fontWeight: 700}} component="h1" variant="h5">
                        COMMUNITY CATALYST
                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log In
                    </Typography>
                    <form onSubmit={formik.handleSubmit} autoComplete="on">
                        <TextField
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Email Address*"
                            name="username"
                            value={formik.values.username}
                            onChange={e => {
                                setLoginError('');
                                formik.handleChange(e);
                            }}
                            error={(formik.touched.username && Boolean(formik.errors.username)) || (loginError !== '')}
                            helperText={formik.touched.username && (formik.errors.username || loginError)}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password*"
                            type="password"
                            id="password"
                            value={formik.values.password}
                            onChange={e => {
                                setLoginError('');
                                formik.handleChange(e)
                            }}
                            error={(formik.touched.password && Boolean(formik.errors.password)) || (loginError !== '')}
                            helperText={formik.touched.password && (formik.errors.password || loginError)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Log In
                        </Button>
                    </form>
                </Box>
            </Container>
        </Box>
    );
}

LogIn.propTypes = {
    setToken: PropTypes.func.isRequired
}
