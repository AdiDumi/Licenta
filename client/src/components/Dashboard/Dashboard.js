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
            date: "o data",
            type: "improve"
        },
        {
            reporter: "Aldi",
            message: "You did it!",
            date: "o data",
            type: "improve"
        },
        {
            reporter: "Nico",
            message: "You did it!",
            date: "o data",
            type: "good"
        },
        {
            reporter: "Alin2",
            message: "You did it!",
            date: "o data",
            type: "improve"
        },
        {
            reporter: "Aldi2",
            message: "You did it!",
            date: "o data",
            type: "good"
        },
        {
            reporter: "Nico2",
            message: "You did it!",
            date: "o data",
            type: "good"
        },
        {
            reporter: "Nico222",
            message: "You did it!",
            date: "o data",
            type: "good"
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
                                    border: 1,
                                    borderColor: 'blue'
                                }}
                            >
                                <Typography> Your last feedbacks </Typography>
                                <Grid container spacing={4}>
                                    {feedbacks.length > 0 ? feedbacks.slice(0,6).map((feedback, index) => (
                                        <Grid item xs={"auto"} sm={6} md={4} key={index}>
                                            <Card sx={{
                                                minWidth: 275,
                                                border: 3,
                                                borderColor: (feedback.type === 'good') ? '#2196f3' : (feedback.type === 'improve') ? 'yellow' : 'black'
                                            }}>
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 18 }} color="text.secondary" component="div">
                                                            From <Typography sx={{textDecoration: 'underline', fontSize: 18}} display="inline" color="text.primary">{feedback.reporter}</Typography>
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 15 }} color="text.secondary" gutterBottom>
                                                            On {feedback.date}
                                                        </Typography>
                                                        <Typography noWrap variant="h5" component="div">
                                                            {feedback.message}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                                <CardActions>
                                                    <Button startIcon={<Add/>} onClick={handleFeed} size="small">Feed Back</Button>
                                                </CardActions>
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