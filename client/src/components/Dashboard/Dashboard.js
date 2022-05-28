import React, {useEffect} from 'react';
import {
    Box, Button, Card, CardActions, CardContent, Grid, Typography,
} from "@mui/material";
import axios from "axios";
import AppBarDrawer from "../AppBar/AppBarDrawer";

export default function Dashboard({deleteToken}) {
    const [feedbacks, setFeedbacks] = React.useState([])

    useEffect(() => {
       axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedbacks', {
           params: {
               number: 6
           }
       }).then(response => {
           setFeedbacks(response.data);
       })
    }, []);

    return(
        <div>
        <AppBarDrawer deleteToken={deleteToken} currentPage={"Dashboard"}/>
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                backgroundColor: '#FFFFFF',
            }}>
                <Grid container spacing={4} sx={{
                    justify: "center",
                    paddingLeft: "40px",
                    paddingRight: "40px",
                }}>
                    {feedbacks.length > 0 ? feedbacks.map(feedback => (
                        <Grid item xs={"auto"} sm={6} md={4} key={feedback.key}>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        From Joe
                                    </Typography>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        On 02/02/2022
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        Nice work!
                                    </Typography>
                                    <Typography variant="body2">
                                        Foarte bine organizat
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Feed Back</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )) : <div> No Feedbacks </div>}
                </Grid>
            </Box>
        </div>
    );
}