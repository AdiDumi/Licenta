import React, {useEffect} from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Container,
    CssBaseline,
    Grid, LinearProgress,
    Paper, Skeleton,
    Toolbar,
    Typography,
} from "@mui/material";
import axios from "axios";
import {ThumbUp} from "@mui/icons-material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
import {useNavigate} from "react-router-dom";


export default function Dashboard({deleteToken, token}) {
    const [feedbacks, setFeedbacks] = React.useState([]);
    const [objectives, setObjectives] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/recv', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
             setFeedbacks(response.data);
            setLoading(false);
        }).catch(error => {
            if(error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        });
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/main', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setObjectives(response.data.filter(objective => (objective.status === 1)));
            setLoading(false);
        }).catch(error => {
            if (error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        });
    }, []);

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
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, }}>
                    <Grid container spacing={3}>
                        {/* Last Feedbacks */}
                        <Grid item sm={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    border: 1,
                                    borderColor: 'blue',
                                    height: 380,
                                    backgroundColor: '#669BBC'
                                }}
                            >
                                <Typography> Your last feedbacks </Typography>
                                {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                    <Grid container spacing={4}>
                                        {feedbacks.length > 0 ? feedbacks
                                            .sort((a, b) => (a.seen > b.seen) ? 1 : (a.seen === b.seen) ? ((new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1) : -1)
                                            .slice(0, 6)
                                            .map(feedback => (
                                                <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                                    {feedback.seen === false ? <Typography sx={{ color: '#E71523' }}>New</Typography> : <Typography> &nbsp; </Typography>}
                                                    <Card sx={{
                                                        minWidth: 250,
                                                        border: 3,
                                                        borderColor: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                        position: 'relative'
                                                    }}>
                                                        <CardActionArea onClick={() => navigate("/feedbacks")}>
                                                            <CardContent>
                                                                <Box sx={{display: "flex"}}>
                                                                    {feedback.anonymous === true ?
                                                                        <Typography sx={{fontSize: 17, marginRight: 'auto', maxWidth: 700}}
                                                                                    color="text.secondary" component="div">
                                                                            Anonymous
                                                                        </Typography> :
                                                                        <Typography sx={{fontSize: 17, marginRight: 'auto', maxWidth: 700}}
                                                                                    color="text.secondary"
                                                                                    component="div"> From:
                                                                            <Typography sx={{
                                                                                textDecoration: 'underline',
                                                                                fontSize: 18,
                                                                                marginRight: 'auto', maxWidth: 700
                                                                            }} display="inline" color="text.primary">
                                                                                {feedback.reporter.displayName}
                                                                            </Typography>
                                                                        </Typography>
                                                                    }
                                                                    {feedback.appreciated === true ?
                                                                        <ThumbUp sx={{
                                                                            color: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black'
                                                                        }}/>
                                                                        : null
                                                                    }
                                                                </Box>
                                                                <Typography sx={{fontSize: 15}} color="text.secondary"
                                                                            gutterBottom>
                                                                    On {new Date(feedback.receivedDate).toDateString()}
                                                                </Typography>
                                                                <Typography noWrap variant="h5" component="div">
                                                                    {feedback.message}
                                                                </Typography>
                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                </Grid>
                                            )) : null}
                                    </Grid>
                                }
                            </Paper>
                        </Grid>
                        {/* Last Objectives */}
                        <Grid item sm={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    border: 1,
                                    borderColor: 'red',
                                    height: 380,
                                    backgroundColor: '#4A4E69'
                                }}
                            >
                                <Typography>Your last objectives</Typography>
                                {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                    <Grid container spacing={2} sx={{height: 550}}>
                                        {objectives.length > 0 ? objectives
                                            .slice(0, 3)
                                            .map((objective) =>(
                                                <Grid item sm={12} key={objective._id}>
                                                    <Card sx={{
                                                        width: 1100,
                                                        border: 2,
                                                        borderColor: '#C1121F',
                                                        position: 'relative',
                                                    }}>
                                                        <CardActionArea onClick={() => navigate("/objectives")}>
                                                            <CardContent>
                                                                <Box sx={{display: "flex"}}>
                                                                    <Typography noWrap sx={{ fontSize: 20, marginRight: 'auto', maxWidth: 700 }} color="text.primary" component="div">
                                                                        {objective.title}
                                                                    </Typography>
                                                                    <Typography component="div" sx={{
                                                                        color: '#C1121F'
                                                                    }}>
                                                                         In progress
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Box sx={{ width: '100%', mr: 1 }}>
                                                                        <LinearProgress variant="determinate" value={parseFloat(objective.progress)} color='progress'/>
                                                                    </Box>
                                                                    <Box sx={{ minWidth: 35 }}>
                                                                        <Typography variant="body2" sx={{ color: '#C1121F'}}>
                                                                            {objective.progress}%
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                </Grid>
                                            )) : null}
                                    </Grid>
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}