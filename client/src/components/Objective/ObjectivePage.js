import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    CssBaseline,
    Grid,
    Skeleton,
    Tab,
    Tabs,
    Toolbar,
    Typography
} from "@mui/material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
import {
    AddTaskTwoTone,
    GroupWorkTwoTone, ThumbUp,
    TrackChangesTwoTone
} from "@mui/icons-material";
import axios from "axios";

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        value === index && (
            <Box sx={{ p: 2}}>
                {children}
            </Box>
        )
    );
}

export default function Objectives({deleteToken, token}) {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [tab, setTab] = React.useState(0);

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/team', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setLoading(false);
        }).catch(error => {
            if (error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        })
    });

    return(
        <Box sx={{ display: 'flex' }}>
            <CssBaseline/>
            <AppBarDrawer deleteToken={deleteToken} currentPage={"Feedbacks"}/>
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3
            }}>
                <Toolbar/>
                <Container maxWidth="lg">
                    <Grid container spacing={1}>
                        {/* Add objective button */}
                        <Grid item sm={12}>
                            <Button startIcon={<AddTaskTwoTone/>} variant={"contained"}> Add an objective</Button>
                        </Grid>
                        {/* Objetives tabs */}
                        <Grid item sm={12}>
                            <Tabs value={tab} textColor='primary' variant="fullWidth" centered selectionFollowsFocus onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab sx={{ fontSize: 18 }} icon={<TrackChangesTwoTone />} iconPosition="start" label="My Objectives"/>
                                <Tab sx={{ fontSize: 18 }} icon={<GroupWorkTwoTone />} iconPosition="start" label="Team Objectives"/>
                            </Tabs>
                        </Grid>
                        <TabPanel value={tab} index={0}>
                            {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                <Grid container spacing={2} sx={{height: 540}}>
                                    <Grid item sm={12}>
                                        <Card sx={{
                                            width: 1100,
                                            border: 3,
                                            borderColor: 'black',
                                            position: 'relative',
                                        }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div">
                                                    Anonymous
                                                </Typography>
                                                <Typography noWrap sx={{ fontSize: 30 }} component="div">
                                                    Mesaj
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            }
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                <Grid container spacing={2} sx={{height: 540}}>
                                    <Grid item xs={"auto"} sm={12} md={4}>
                                        <Card fullWidth sx={{
                                            border: 3,
                                            borderColor: 'black',
                                            position: 'relative',
                                        }} >
                                        </Card>
                                    </Grid>
                                </Grid>
                            }
                        </TabPanel>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}