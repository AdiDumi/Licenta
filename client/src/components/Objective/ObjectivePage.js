import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, InputAdornment, Pagination,
    Skeleton, Snackbar,
    Tab,
    Tabs, TextField,
    Toolbar,
    Typography
} from "@mui/material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
import {
    AddTaskTwoTone,
    GroupWorkTwoTone,
    TrackChangesTwoTone,
} from "@mui/icons-material";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import {DesktopDatePicker} from "@mui/x-date-pickers";

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        value === index && (
            <Box sx={{ p: 2}}>
                {children}
            </Box>
        )
    );
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Objectives({deleteToken, token}) {
    const navigate = useNavigate();
    const [mainId, setMainId] = React.useState('');
    const [secondTargetUnit, setSecondTargetUnit] = React.useState('');
    const [secondTarget, setSecondTarget] = React.useState(0);
    const [isManager, setIsManager] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [tab, setTab] = React.useState(0);
    const [render, setRender] = React.useState('');
    const [openForm, setOpenForm] = React.useState(false);
    const [openFormSecond, setOpenFormSecond] = React.useState(false);
    const [mainObjectiveDescription, setMainObjectiveDescription] = React.useState('');
    const [mainObjectiveTitle, setMainObjectiveTitle] = React.useState('');
    const [errorMainObjectiveDescription, setErrorMainObjectiveDescription] = React.useState('');
    const [errorMainObjectiveTitle, setErrorMainObjectiveTitle] = React.useState('');
    const [errorSecondObjectiveTargetUnit, setErrorSecondObjectiveTargetUnit] = React.useState('');
    const [errorSecondObjectiveTarget, setErrorSecondObjectiveTarget] = React.useState('');
    const [errorDeadline, setErrorDeadline] = React.useState('');
    const [pagePersonalObjectives, setPagePersonalObjectives] = React.useState(1);
    const [numberOfPagesPersonalObjectives, setNumberOfPagesPersonalObjectives] = React.useState(1);
    const [pageTeamObjectives, setPageTeamObjectives] = React.useState(1);
    const [numberOfPagesTeamObjectives, setNumberOfPagesTeamObjectives] = React.useState(1);
    const [mainPersonalObjectives, setMainPersonalObjectives] = React.useState([]);
    const [mainTeamObjectives, setMainTeamObjectives] = React.useState([]);
    const [openSnackbarSuccess, setOpenSnackbarSuccess] = React.useState(false);
    const [openSnackbarError, setOpenSnackbarError] = React.useState(false);
    const [date, setDate] = React.useState(new Date().toJSON().slice(0,10).replace(/-/g,'/'));

    const objectivesPerPage = 4;

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const handleClickOpenForm = () => {
        setOpenForm(true);
    };

    const handleClickOpenFormSecond = (event) => {
        setMainId(event.currentTarget.attributes.objectid.textContent);
        setOpenFormSecond(true);
    };

    const handleCloseSnackbarSuccess = () => {
        setOpenSnackbarSuccess(false);
    };

    const handleCloseSnackbarError = () => {
        setOpenSnackbarError(false);
    };

    const handleCloseForm = () => {
        setMainObjectiveDescription('');
        setMainObjectiveTitle('');
        setErrorMainObjectiveDescription('');
        setErrorMainObjectiveTitle('');
        setOpenForm(false);
    };

    const handleCloseFormSecond = () => {
        setMainObjectiveDescription('');
        setMainObjectiveTitle('');
        setErrorMainObjectiveDescription('');
        setErrorMainObjectiveTitle('');
        setSecondTarget(0);
        setSecondTargetUnit('');
        setDate(new Date().toJSON().slice(0,10).replace(/-/g,'/'))
        setErrorSecondObjectiveTarget('');
        setErrorSecondObjectiveTargetUnit('');
        setErrorDeadline('');
        setOpenFormSecond(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(mainObjectiveTitle !== '' && mainObjectiveDescription !== '') {
            axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/addMain',
                {
                    title: mainObjectiveTitle,
                    description: mainObjectiveDescription
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                console.log(response.data);
                setOpenSnackbarSuccess(true);
                setRender(Math.random(100).toString());
            }).catch(error => {
                if(error.response.data.error === 'Authentification failed. Check secret token.') {
                    deleteToken();
                    navigate("/");
                }
                setOpenSnackbarError(true)
            });
            handleCloseForm();
        } else {
            if(mainObjectiveTitle === '') {
                setErrorMainObjectiveTitle("Description cannot be empty");
            }
            if(mainObjectiveDescription === '') {
                setErrorMainObjectiveDescription("Title cannot be empty");
            }
        }
    };

    function isNaturalNumber(n) {
        n = n.toString(); // force the value incase it is not
        let n1 = Math.abs(n), n2 = parseInt(n, 10);
        return !isNaN(n1) && n2 === n1 && n1.toString() === n && n1 !== 0;
    }

    const handleSubmitSecond = (event) => {
        event.preventDefault();
        console.log("HELLO");
        if(mainObjectiveTitle !== '' &&
            mainObjectiveDescription !== '' &&
            isNaturalNumber(secondTarget) &&
            secondTargetUnit!== '' &&
            !isNaN(Date.parse(date)) &&
            new Date(date).getTime() > new Date(new Date().toJSON().slice(0,10).replace(/-/g,'/')).getTime()) {
            axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/addSecondary',
                {
                    title: mainObjectiveTitle,
                    description: mainObjectiveDescription,
                    target: secondTarget,
                    targetUnitMeasure: secondTargetUnit,
                    mainObjective: mainId,
                    deadline: date
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                console.log(response.data);
                setOpenSnackbarSuccess(true);
                setRender(Math.random(100).toString());
            }).catch(error => {
                if(error.response.data.error === 'Authentification failed. Check secret token.') {
                    deleteToken();
                    navigate("/");
                }
                setOpenSnackbarError(true)
            });
            handleCloseFormSecond();
        } else {
            if(mainObjectiveTitle === '') {
                console.log("here1");
                setErrorMainObjectiveTitle("Description cannot be empty");
            }
            if(mainObjectiveDescription === '') {
                console.log("here2");

                setErrorMainObjectiveDescription("Title cannot be empty");
            }
            if(secondTargetUnit === '') {
                console.log("here3");

                setErrorSecondObjectiveTargetUnit("Target unit cannot be empty");
            }
            if(!isNaturalNumber(secondTarget)) {
                console.log("here4");

                setErrorSecondObjectiveTarget("Target is not valid");
            }
            if(isNaN(Date.parse(date)) || new Date(date).getTime() < new Date(new Date().toJSON().slice(0,10).replace(/-/g,'/')).getTime()) {
                console.log("here5");

                setErrorDeadline('Invalid deadline');
            }
        }
    };

    useEffect(() => {
        setNumberOfPagesPersonalObjectives(Math.ceil(mainPersonalObjectives.length/objectivesPerPage));
    }, [mainPersonalObjectives]);

    useEffect(() => {
        setNumberOfPagesTeamObjectives(Math.ceil(mainTeamObjectives.length/objectivesPerPage));
    }, [mainTeamObjectives]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/main', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            const mainPersonalObjectives = response.data;
            mainPersonalObjectives.forEach(main => {
                main["secondary"] = [];
                axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/secondary', {
                    params: {
                        mainObjective: main._id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                    main["secondary"] = main["secondary"].concat(response.data);
                }).catch(error => {
                    if (error.response.data.error === 'Authentification failed. Check secret token.') {
                        deleteToken();
                        navigate("/");
                    }
                });
            })
            setMainPersonalObjectives(mainPersonalObjectives);
            setLoading(false);
        }).catch(error => {
            if (error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        });
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/team/main', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setIsManager(response.data["isManager"]);
            const mainTeamObjectives = response.data["objectives"]
            mainTeamObjectives.forEach(main => {
                main["secondary"] = [];
                axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/team/secondary', {
                    params: {
                        mainObjective: main._id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                    setIsManager(response.data["isManager"]);
                    main["secondary"] = main["secondary"].concat(response.data["objectives"]);
                }).catch(error => {
                    if (error.response.data.error === 'Authentification failed. Check secret token.') {
                        deleteToken();
                        navigate("/");
                    }
                });
            });
            setMainTeamObjectives(mainTeamObjectives);
            setLoading(false);
        }).catch(error => {
            if (error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        });
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
                            <Button startIcon={<AddTaskTwoTone/>} variant={"contained"} onClick={handleClickOpenForm}> New objective</Button>
                        </Grid>
                        {/* Objetives tabs */}
                        <Grid item sm={12}>
                            <Tabs value={tab} textColor='primary' variant="fullWidth" centered selectionFollowsFocus onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab sx={{ fontSize: 18 }} icon={<TrackChangesTwoTone />} iconPosition="start" label="My Objectives"/>
                                {isManager === true ? <Tab sx={{ fontSize: 18 }} icon={<GroupWorkTwoTone />} iconPosition="start" label="Team Objectives"/> : null}
                            </Tabs>
                        </Grid>
                        <TabPanel value={tab} index={0}>
                            {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                <Grid container spacing={2} sx={{height: 550}}>
                                    {mainPersonalObjectives.length > 0 ? mainPersonalObjectives
                                        .sort((a, b) => (a.done === b.done)? 0 : a.done? 1 : -1)
                                        .slice((pagePersonalObjectives - 1) * objectivesPerPage, pagePersonalObjectives * objectivesPerPage)
                                        .map((objective) =>(
                                        <Grid item sm={12} key={objective._id}>
                                            <Card sx={{
                                                width: 1100,
                                                border: 2,
                                                borderColor: objective.done === false ? (objective.secondary.length > 0 ? '#C1121F' : 'black') : 'green',
                                                position: 'relative',
                                            }}>
                                                <CardContent>
                                                    <Box sx={{display: "flex"}}>
                                                        <Typography noWrap sx={{ fontSize: 17, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div">
                                                            {objective.title}
                                                        </Typography>
                                                        <Typography component="div" sx={{
                                                            color: objective.done === false ? (objective.secondary.length > 0 ? '#C1121F' : 'black') : 'green',
                                                        }}>
                                                            {objective.done === false ? (objective.secondary.length > 0 ? 'In progress' : 'Not started') : 'Done'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{display: "flex"}}>
                                                        <Typography noWrap sx={{ fontSize: 20, marginRight: 'auto', maxWidth: 900 }} component="div">
                                                            {objective.description}
                                                        </Typography>
                                                        <Button sx={{
                                                            color: 'black'
                                                        }} variant={"outlined"} startIcon={<AddTaskTwoTone/>} onClick={handleClickOpenFormSecond} objectid={objective._id}>
                                                            Goals
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )) : null}
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
                                <Grid container spacing={2} sx={{height: 550}}>
                                    {mainTeamObjectives.length > 0 ? mainTeamObjectives
                                        .sort((a, b) => (a.done === b.done)? 0 : a.done? 1 : -1)
                                        .slice((pageTeamObjectives - 1) * objectivesPerPage, pageTeamObjectives * objectivesPerPage)
                                        .map((objective) =>(
                                            <Grid item sm={12} key={objective._id}>
                                                <Card sx={{
                                                    width: 1100,
                                                    border: 2,
                                                    borderColor: objective.done === false ? (objective.secondary.length > 0 ? '#C1121F' : 'black') : 'green',
                                                    position: 'relative',
                                                }}>
                                                    <CardContent>
                                                        <Box sx={{display: "flex"}}>
                                                            <Typography noWrap sx={{ fontSize: 17, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div">
                                                                {objective.title}
                                                            </Typography>
                                                            <Typography sx={{
                                                                color: objective.done === false ? (objective.secondary.length > 0 ? '#C1121F' : 'black') : 'green',
                                                            }}>
                                                                {objective.done === false ? (objective.secondary.length > 0 ? 'In progress' : 'Not started') : 'Done'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{display: "flex"}}>
                                                            <Typography noWrap sx={{ fontSize: 20, marginRight: 'auto', maxWidth: 900 }} component="div">
                                                                {objective.description}
                                                            </Typography>
                                                            <Button sx={{
                                                                color: 'primary'
                                                            }} variant={"outlined"} startIcon={<AddTaskTwoTone/>} onClick={handleClickOpenFormSecond} objectid={objective._id}>
                                                                Goals
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )) : null}
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
                <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth={"md"}>
                    <form
                        id="myform"
                        onSubmit={handleSubmit}
                    >
                        <DialogTitle variant="h6">Add a main objective</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="mainTitle"
                                label="Objective Title"
                                type="text"
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                value={mainObjectiveTitle}
                                onChange={e => {
                                    setMainObjectiveTitle(e.target.value)
                                    setErrorMainObjectiveTitle('');
                                }}
                                error={errorMainObjectiveTitle !== ''}
                                helperText={errorMainObjectiveTitle !== '' && errorMainObjectiveTitle}
                            />
                            <br/>
                            <br/>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="mainDescription"
                                label="Objective Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={5}
                                variant="outlined"
                                value={mainObjectiveDescription}
                                onChange={e => {
                                    setMainObjectiveDescription(e.target.value)
                                    setErrorMainObjectiveDescription('');
                                }}
                                error={errorMainObjectiveDescription !== ''}
                                helperText={errorMainObjectiveDescription !== '' && errorMainObjectiveDescription}
                            />
                        </DialogContent>
                        <DialogActions sx={{display: 'flex'}}>
                            <Button variant={"contained"} color='error' onClick={handleCloseForm} sx={{marginRight: 'auto'}}>Cancel</Button>
                            <Button type="submit" variant={"contained"} color={'success'} form="myform">Send</Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={openFormSecond} onClose={handleCloseFormSecond} fullWidth maxWidth={"lg"}>
                    <form
                        id="myformSecond"
                        onSubmit={handleSubmitSecond}
                    >
                        <DialogTitle variant="h6">Add a secondary objective</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="secondTitle"
                                label="Secondary Objective Title"
                                type="text"
                                fullWidth
                                multiline
                                variant="outlined"
                                value={mainObjectiveTitle}
                                onChange={e => {
                                    setMainObjectiveTitle(e.target.value)
                                    setErrorMainObjectiveTitle('');
                                }}
                                error={errorMainObjectiveTitle !== ''}
                                helperText={errorMainObjectiveTitle !== '' && errorMainObjectiveTitle}
                            />
                            <br/>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="secondDescription"
                                label="Secondary Objective Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                value={mainObjectiveDescription}
                                onChange={e => {
                                    setMainObjectiveDescription(e.target.value)
                                    setErrorMainObjectiveDescription('');
                                }}
                                error={errorMainObjectiveDescription !== ''}
                                helperText={errorMainObjectiveDescription !== '' && errorMainObjectiveDescription}
                            />
                            <br/>
                            <br/>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Target Units"
                                    id="targetUnits"
                                    variant="outlined"
                                    type="text"
                                    multiline
                                    value={secondTargetUnit}
                                    onChange={e => {
                                        setSecondTargetUnit(e.target.value)
                                        setErrorSecondObjectiveTargetUnit('');
                                    }}
                                    error={errorSecondObjectiveTargetUnit !== ''}
                                    helperText={errorSecondObjectiveTargetUnit !== '' && errorSecondObjectiveTargetUnit}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Target"
                                    id="target"
                                    variant="outlined"
                                    type="number"
                                    value={secondTarget}
                                    onChange={e => {
                                        setSecondTarget(e.target.value)
                                        setErrorSecondObjectiveTarget('');
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position={"start"}>{secondTargetUnit}</InputAdornment>
                                    }}
                                    error={errorSecondObjectiveTarget !== ''}
                                    helperText={errorSecondObjectiveTarget !== '' && errorSecondObjectiveTarget}
                                />
                                <DesktopDatePicker
                                    label="Deadline"
                                    inputFormat="MM/dd/yyyy"
                                    value={date}
                                    onChange={(newDate) => {
                                        setDate(newDate);
                                        setErrorDeadline('');
                                    }}
                                    minDate={new Date()}
                                    renderInput={(params) =>
                                        <TextField margin="dense"
                                        error={errorDeadline !== ''}
                                        helperText={errorDeadline !== '' && errorDeadline}
                                        {...params}
                                    />}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{display: 'flex'}}>
                            <Button variant={"contained"} color='error' onClick={handleCloseFormSecond} sx={{marginRight: 'auto'}}>Cancel</Button>
                            <Button type="submit" variant={"contained"} color={'success'} form="myformSecond">Add</Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <Snackbar open={openSnackbarSuccess} autoHideDuration={6000} onClose={handleCloseSnackbarSuccess}>
                    <Alert onClose={handleCloseSnackbarSuccess} severity="success" sx={{ width: '100%' }}>
                        Feedback sent successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={openSnackbarError} autoHideDuration={6000} onClose={handleCloseSnackbarError}>
                    <Alert onClose={handleCloseSnackbarError} severity="error" sx={{ width: '100%' }}>
                        Feedback add failed!
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}