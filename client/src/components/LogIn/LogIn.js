import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {Container, Avatar, Typography, Button, TextField, Box, CssBaseline} from '@mui/material';

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

export default function LogIn({setToken}) {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: 'email@bitdefender.biz',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            console.log(values);
            try {
                axios.post('http://localhost:5000/login', JSON.stringify(values)).then(response => {
                    setToken(response.data.token);
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
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
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
