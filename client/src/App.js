import React, {useEffect} from 'react';
import { Container } from '@mui/material';
import {Routes, Route } from 'react-router-dom';

import LogIn from './components/LogIn/LogIn';
import Dashboard from "./components/Dashboard/Dashboard";

function setToken(userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
}

function App() {
    const token = getToken();

    useEffect(() => {
        if (!token) {
            return <LogIn setToken={setToken}/>
        }
    });

    return (
        <Container maxWidth="lg">
            <Routes>
                <Route path="/" exact element={<LogIn setToken={setToken}/>}/>
                <Route path="/dashboard" exact element={<Dashboard/>}/>
            </Routes>
        </Container>
    );
}

export default App;
