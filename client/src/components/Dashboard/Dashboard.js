import React, {useEffect} from 'react';
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
import {Add, ThumbUp} from "@mui/icons-material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
import {useNavigate} from "react-router-dom";


export default function Dashboard({deleteToken, token}) {
    const [feedbacks, setFeedbacks] = React.useState([])
    const navigate = useNavigate();

    useEffect(() => {
       axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/recv', {
           headers: {
               'Authorization': 'Bearer ' + token
           }
       }).then(response => {
            setFeedbacks(response.data);
       }).catch(error => {
           if(error.response.data.error === 'Authentification failed. Check secret token.') {
               deleteToken();
               navigate("/");
           }
       })
    }, []);

    const handleFeed = () => {
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
                                    borderColor: 'blue',
                                    backgroundColor: '#c4ffc2'
                                }}
                            >
                                <Typography> Your last feedbacks </Typography>
                                <Grid container spacing={4}>
                                    {feedbacks.length > 0 ? feedbacks
                                        .sort((a, b) => (a.seen > b.seen) ? 1 : (a.seen === b.seen) ? ((new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1) : -1)
                                        .slice(0,6)
                                        .map(feedback => (
                                        <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                            <Card sx={{
                                                minWidth: 275,
                                                border: 3,
                                                borderColor: (feedback.type === 1) ? '#2196f3' : (feedback.type === 2) ? 'yellow' : 'black',
                                                position: 'relative'
                                            }}>
                                                <CardActionArea>
                                                    <CardContent>
                                                        {feedback.anonymous === true ?
                                                            <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div">
                                                                Anonymous
                                                            </Typography> :
                                                            <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div"> From:
                                                                <Typography sx={{textDecoration: 'underline', fontSize: 18}} display="inline" color="text.primary">
                                                                    {feedback.reporter}
                                                                </Typography>
                                                            </Typography>
                                                        }
                                                        {feedback.appreciated === true ?
                                                            <ThumbUp sx={{
                                                                position: 'absolute',
                                                                left: '300px',
                                                                bottom: '80px',
                                                                color: (feedback.type === 1) ? '#2196f3' : (feedback.type === 2) ? 'yellow' : 'black'
                                                            }}/>
                                                            : null
                                                        }
                                                        <Typography sx={{ fontSize: 15 }} color="text.secondary" gutterBottom>
                                                            On {new Date(feedback.receivedDate).toDateString()}
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
                                    )) : <Typography> No last Feedbacks </Typography>}
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
                                    border: 1,
                                    borderColor: 'red',
                                    backgroundColor: '#c4ffc2'
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