import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import logo from '../../images/CommunityCatalystLogo.png';
import {Container, Avatar, Button, TextField, Box, CssBaseline} from '@mui/material';

const validationSchema = yup.object({
    username: yup
        .string('Enter your username')
        .required('Username is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
});

export default function LogIn({setToken, token}) {
    const navigate = useNavigate();
    const [loginError, setLoginError] = React.useState("");

    const formik = useFormik({
        initialValues: {
            username: 'developer@grow.app',
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
    });

    useEffect(() => {
        if(token) {
            navigate("/dashboard");
        }
    });

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
                    <Avatar src={logo} sx={{width: 350, height: 350}}/>
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
                            color='primary'
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
