import React from 'react';
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
            <Routes>
                <Route path="/" exact element={<LogIn setToken={setToken}/>}/>
                <Route path="/dashboard" exact element={<Dashboard deleteToken={deleteToken} token={token}/>}/>
                <Route path="/feedbacks" exact element={<Feedbacks deleteToken={deleteToken} token={token}/>}/>
            </Routes>
    );
}

export default App;
