import React from 'react';
import { Container } from '@mui/material';
import {Routes, Route } from 'react-router-dom';

import LogIn from './components/LogIn/LogIn';
import Dashboard from "./components/Dashboard/Dashboard";
import Feedbacks from "./components/Feedback/FeedbackPage";
import {useToken} from "./useToken";

function App() {
    const { token, setToken, deleteToken } = useToken();

    if (!token) {
        return <LogIn setToken={setToken}/>
    }

    return (
        <Container maxWidth="lg">
            <Routes>
                <Route path="/" exact element={<LogIn setToken={setToken}/>}/>
                <Route path="/dashboard" exact element={<Dashboard deleteToken={deleteToken}/>}/>
                <Route path="/feedbacks" exact element={<Feedbacks deleteToken={deleteToken}/>}/>
            </Routes>
        </Container>
    );
}

export default App;
