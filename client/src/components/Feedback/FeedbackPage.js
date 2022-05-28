import React  from 'react';
import {
    Typography
} from "@mui/material";
import AppBarDrawer from "../AppBar/AppBarDrawer";



export default function Feedbacks({deleteToken}) {

    return(
        <div>
            <AppBarDrawer deleteToken={deleteToken} currentPage={"Feedbacks"}/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <Typography>
                Feedbacks
            </Typography>
        </div>
    );
}