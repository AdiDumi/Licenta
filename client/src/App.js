import React from 'react';
import {Routes, Route } from 'react-router-dom';

import LogIn from './components/LogIn/LogIn';
import Dashboard from "./components/Dashboard/Dashboard";
import Feedbacks from "./components/Feedback/FeedbackPage";
import {useToken} from "./useToken";
import Objectives from "./components/Objective/ObjectivePage";
import {Box, CssBaseline} from "@mui/material";
import AppBarDrawer from "./components/AppBar/AppBarDrawer";

function App() {
    const [page, setPage] = React.useState('');
    const { token, setToken, deleteToken } = useToken();

    if (!token) {
        return <LogIn setToken={setToken} token={token}/>
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline/>
            <AppBarDrawer token={token} deleteToken={deleteToken} currentPage={page}/>
            <Routes>
                <Route path="/" exact element={<LogIn setToken={setToken} token={token}/>}/>
                <Route path="/dashboard" exact element={<Dashboard deleteToken={deleteToken} token={token} setPage={setPage}/>}/>
                <Route path="/feedbacks" exact element={<Feedbacks deleteToken={deleteToken} token={token} setPage={setPage}/>}/>
                <Route path="/objectives" exact element={<Objectives deleteToken={deleteToken} token={token} setPage={setPage}/>}/>
            </Routes>
        </Box>
    );
}

export default App;
