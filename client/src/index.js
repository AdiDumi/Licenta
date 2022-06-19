import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from "./reportWebVitals";

import App from './App';
import './index.css';
import {BrowserRouter} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"

const theme = createTheme({
    palette: {
        primary: {
            main: "#14213D",
        },
        secondary: {
            main: "#FDF0D5"
        },
        good: {
            main: "#0053A0",
        },
        improve: {
            main: "#EFA825",
        },
        progress: {
            main: "#C1121F"
        }
    }
});

ReactDOM.render(
    <React.StrictMode>

        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <App />
                </LocalizationProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
