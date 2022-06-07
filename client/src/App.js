import React from 'react';
import {Routes, Route } from 'react-router-dom';

import LogIn from './components/LogIn/LogIn';
import Dashboard from "./components/Dashboard/Dashboard";
import Feedbacks from "./components/Feedback/FeedbackPage";
import {useToken} from "./useToken";
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

function App() {
    const { token, setToken, deleteToken } = useToken();

    if (!token) {
        return <LogIn setToken={setToken}/>
    }

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/" exact element={<LogIn setToken={setToken}/>}/>
                <Route path="/dashboard" exact element={<Dashboard deleteToken={deleteToken} token={token}/>}/>
                <Route path="/feedbacks" exact element={<Feedbacks deleteToken={deleteToken} token={token}/>}/>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
