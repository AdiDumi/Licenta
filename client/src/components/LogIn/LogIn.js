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
        .min(6, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

export default function LogIn({setToken}) {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: 'cn=admin,dc=grow,dc=app',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            try {
                axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/login', values).then(response => {
                    setToken(response.data);
                    navigate("/dashboard");
                });
                // }).then(
                //     () => {
                //navigate("/dashboard");
                //window.location.reload();
                //     },
                //     (error) => {
                //         console.log(error);
                //     });
            } catch (error) {
                console.log(error);
            }
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Log In
                </Typography>
                <form onSubmit={formik.handleSubmit} autoComplete="on">
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Email Address"
                      name="username"
                      type="username"
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      error={formik.touched.username && Boolean(formik.errors.username)}
                      helperText={formik.touched.username && formik.errors.username}
                      autoFocus
                  />
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
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
