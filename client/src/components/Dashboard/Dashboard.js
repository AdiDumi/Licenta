import React from 'react';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Container,
    CssBaseline,
    Grid,
    Paper,
    Toolbar,
    Typography,
} from "@mui/material";
import axios from "axios";
import { Add } from "@mui/icons-material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
import {useNavigate} from "react-router-dom";


export default function Dashboard({deleteToken}) {
    //const [feedbacks, setFeedbacks] = React.useState([])
    const navigate = useNavigate();
    const feedbacks = [
        {
            reporter: "Alin",
            message: "You did it!",
            date: "o data"
        },
        {
            reporter: "Aldi",
            message: "You did it!",
            date: "o data"
        },
        {
            reporter: "Nico",
            message: "You did it!",
            date: "o data"
        },
        {
            reporter: "Alin2",
            message: "You did it!",
            date: "o data"
        },
        {
            reporter: "Aldi2",
            message: "You did it!",
            date: "o data"
        },
        {
            reporter: "Nico2",
            message: "You did it!",
            date: "o data"
        },
    ];
    //useEffect(() => {
       // axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedbacks', {
       //     params: {
       //         number: 6
       //     }
       // }).then(response => {
        // setFeedbacks(response.data);
       // })
    // }, []);

    const handleFeed = event => {
        navigate("/feedbacks")
    }

    return(
        <Box sx={{ display: 'flex' }}>
            <CssBaseline/>
            <AppBarDrawer deleteToken={deleteToken} currentPage={"Dashboard"}/>
            <Box component="main" sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}>
                <Toolbar/>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: '#FFFFFF', }}>
                    <Grid container spacing={3}>
                        {/* Last Feedbacks */}
                        <Grid item sm={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography> Your last feedbacks </Typography>
                                <Grid container spacing={4}>
                                    {feedbacks.length > 0 ? feedbacks.map(feedback => (
                                        <Grid item xs={"auto"} sm={6} md={4} key={feedback.reporter}>
                                            <Card sx={{ minWidth: 275 }}>
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                            From {feedback.reporter}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                            On {feedback.date}
                                                        </Typography>
                                                        <Typography variant="h5" component="div">
                                                            {feedback.message}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button startIcon={<Add/>} onClick={handleFeed} size="small">Feed Back</Button>
                                                    </CardActions>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    )) : <div> No last Feedbacks </div>}
                                </Grid>
                            </Paper>
                        </Grid>
                        {/* Last Objectives */}
                        <Grid item sm={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div>No last objectives</div>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}