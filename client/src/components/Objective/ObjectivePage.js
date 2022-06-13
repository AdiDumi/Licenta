import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    CssBaseline,
    Grid, Pagination,
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
    const [render, setRender] = React.useState('');
    const [pagePersonalObjectives, setPagePersonalObjectives] = React.useState(1);
    const [numberOfPagesPersonalObjectives, setNumberOfPagesPersonalObjectives] = React.useState(1);
    const [pageTeamObjectives, setPageTeamObjectives] = React.useState(1);
    const [numberOfPagesTeamObjectives, setNumberOfPagesTeamObjectives] = React.useState(1);
    const [mainPersonalObjectives, setMainPersonalObjectives] = React.useState([]);
    const [mainTeamObjectives, setMainTeamObjectives] = React.useState([]);
    const [secondaryPersonalObjectives, setSecondaryPersonalObjectives] = React.useState([]);
    const [secondaryTeamObjectives, setSecondaryTeamObjectives] = React.useState([]);

    const objectivesPerPage = 4;

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    useEffect(() => {
        setNumberOfPagesPersonalObjectives(Math.ceil(mainPersonalObjectives.length/objectivesPerPage));
    }, [mainPersonalObjectives]);

    useEffect(() => {
        setNumberOfPagesTeamObjectives(Math.ceil(mainTeamObjectives.length/objectivesPerPage));
    }, [mainTeamObjectives]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/team', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setMainPersonalObjectives([
                {
                    _id: 1,
                    title: "Primul obiectiv",
                    description: "Descrierea primului",
                    status: 2
                },
                {
                    _id: 2,
                    title: "Al doilea obiectiv",
                    description: "Descrierea celui de al doilea",
                    status: 1
                },
                {
                    _id: 3,
                    title: "Al treilea obiectiv",
                    description: "Descrierea celui de al treilea",
                    status: 0
                },
                {
                    _id: 4,
                    title: "Al patrulea obiectiv",
                    description: "Descrierea celui de al patrulea",
                    status: 1
                },
                {
                    _id: 5,
                    title: "Al cicncilea obiectiv",
                    description: "Descrierea celui de al cinci",
                    status: 2
                }
            ]);
            setMainTeamObjectives([
                {
                    _id: 1,
                    title: "Primul obiectiv",
                    description: "Descrierea primului",
                    status: 2
                },
                {
                    _id: 2,
                    title: "Al doilea obiectiv",
                    description: "Descrierea celui de al doilea",
                    status: 1
                },
                {
                    _id: 3,
                    title: "Al treilea obiectiv",
                    description: "Descrierea celui de al treilea",
                    status: 0
                },
                {
                    _id: 4,
                    title: "Al patrulea obiectiv",
                    description: "Descrierea celui de al patrulea",
                    status: 1
                },
                {
                    _id: 5,
                    title: "Al cicncilea obiectiv",
                    description: "Descrierea celui de al cinci",
                    status: 2
                }
            ]);
            setLoading(false);
        }).catch(error => {
            if (error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        })
    }, [render]);

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
                                    {mainPersonalObjectives.length > 0 ? mainPersonalObjectives
                                        .sort((a, b) => (a.status < b.status) ? 1 : -1)
                                        .slice((pagePersonalObjectives - 1) * objectivesPerPage, pagePersonalObjectives * objectivesPerPage)
                                        .map((objective) =>(
                                        <Grid item sm={12} key={objective._id}>
                                            <Card sx={{
                                                width: 1100,
                                                border: 2,
                                                borderColor: objective.status === 2 ? '#C1121F' : objective.status === 1 ? 'black' : 'green',
                                                position: 'relative',
                                            }}>
                                                <CardContent>
                                                    <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div">
                                                        {objective.title}
                                                    </Typography>
                                                    <Typography sx={{
                                                        position: 'absolute',
                                                        left: '1000px',
                                                        bottom: '50px',
                                                        color: objective.status === 2 ? '#C1121F' : objective.status === 1 ? 'black' : 'green',
                                                    }}>
                                                        {objective.status === 2 ? 'In progress' : objective.status === 1 ? 'Not started' : 'Done'}
                                                    </Typography>
                                                    <Typography noWrap sx={{ fontSize: 20 }} component="div">
                                                        {objective.description}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )) : <Typography>   </Typography>}
                                </Grid>
                            }
                            <Box py={1} display="flex" justifyContent="center" sx={{ position: 'relative', left: '-16px', width: 1137}}>
                                <Pagination
                                    onChange={(e, value) => setPagePersonalObjectives(value)}
                                    style={{
                                        display: mainPersonalObjectives.length > 0 ? "flex" : "none",
                                        justifyContent: "center",
                                    }}
                                    page={pagePersonalObjectives}
                                    color="primary"
                                    count={numberOfPagesPersonalObjectives}/>
                            </Box>
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                <Grid container spacing={2} sx={{height: 540}}>
                                    {mainTeamObjectives.length > 0 ? mainTeamObjectives
                                        .sort((a, b) => (a.status < b.status) ? 1 : -1)
                                        .slice((pageTeamObjectives - 1) * objectivesPerPage, pageTeamObjectives * objectivesPerPage)
                                        .map((objective) =>(
                                            <Grid item sm={12} key={objective._id}>
                                                <Card sx={{
                                                    width: 1100,
                                                    border: 2,
                                                    borderColor: objective.status === 2 ? '#C1121F' : objective.status === 1 ? 'black' : 'green',
                                                    position: 'relative',
                                                }}>
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div">
                                                            {objective.title}
                                                        </Typography>
                                                        <Typography sx={{
                                                            position: 'absolute',
                                                            left: '1000px',
                                                            bottom: '50px',
                                                            color: objective.status === 2 ? '#C1121F' : objective.status === 1 ? 'black' : 'green',
                                                        }}>
                                                            {objective.status === 2 ? 'In progress' : objective.status === 1 ? 'Not started' : 'Done'}
                                                        </Typography>
                                                        <Typography noWrap sx={{ fontSize: 20 }} component="div">
                                                            {objective.description}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )) : <Typography>   </Typography>}
                                </Grid>
                            }
                            <Box py={1} display="flex" justifyContent="center" sx={{ position: 'relative', left: '-16px', width: 1137}}>
                                <Pagination
                                    onChange={(e, value) => setPageTeamObjectives(value)}
                                    style={{
                                        display: mainTeamObjectives.length > 0 ? "flex" : "none",
                                        justifyContent: "center",
                                    }}
                                    page={pageTeamObjectives}
                                    color="primary"
                                    count={numberOfPagesTeamObjectives}/>
                            </Box>
                        </TabPanel>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}