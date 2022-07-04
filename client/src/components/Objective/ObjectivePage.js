import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Card, CardActions,
    CardContent,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, InputAdornment, LinearProgress, List, Pagination, Slider,
    Skeleton, Snackbar,
    Tab,
    Tabs, TextField,
    Toolbar,
    Typography, Divider, DialogContentText
} from "@mui/material";
import {
    AddTaskTwoTone, EditTwoTone,
    GroupWorkTwoTone,
    TrackChangesTwoTone,
} from "@mui/icons-material";
import MuiAlert from "@mui/material/Alert";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {markAsDone, getMainObjectives, editTeam, addMain, addSecondary, editProgress, getSecondaryObjectives, getTeamSecondaryObjectives, getTeamMainObjectives, getProgress} from "../../api/objectivesApi";
import {OBJECTIVES_PER_PAGE} from "../../constants/Constants";

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

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Objectives({deleteToken, token, setPage}) {
    const navigate = useNavigate();
    const [mainId, setMainId] = React.useState('');
    const [secondTargetUnit, setSecondTargetUnit] = React.useState('');
    const [secondTarget, setSecondTarget] = React.useState(0);
    const [isManager, setIsManager] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [tab, setTab] = React.useState(0);
    const [render, setRender] = React.useState(0);
    const [openForm, setOpenForm] = React.useState(false);
    const [openFormSecond, setOpenFormSecond] = React.useState(false);
    const [openFormThird, setOpenFormThird] = React.useState(false);
    const [openFormEdit, setOpenFormEdit] = React.useState(false);
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
    const [sliders, setSliders] = React.useState([]);
    const errorFunction = (error) => {
        if (typeof error.response !== 'undefined') {
            if (error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        } else {
            console.log(error);
        }
    }

    function getDaysDifference(deadline) {
        return (new Date(deadline) - new Date())/(1000 * 60 * 60 * 24)
    }

    function getMarkDone(objective) {
        if(objective.progress === "100.00") {
            return true
        }
        let pastGoal = true
        objective.secondary?.forEach(goal => {
            if(getDaysDifference(goal.deadline) > 0) {
                pastGoal = false;
            }
        })
        return pastGoal
    }

    function handleMarkDone(objective) {
        markAsDone(objective,
            () => {
                setRender(render + 1);
            },
            token,
            (error) => errorFunction(error)
        );
    }

    const handleClickOpenFormSecond = (event) => {
        setMainId(JSON.parse(event.currentTarget.attributes.objectid.textContent));
        setOpenFormSecond(true);
    };

    const handleClickOpenFormThird = (event) => {
        const main = JSON.parse(event.currentTarget.attributes.objectid.textContent);
        setMainId(main);
        setSliders(main.secondary);
        setOpenFormThird(true);
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

    const handleCloseFormThird = () => {
        setSliders([]);
        setOpenFormThird(false);
    }

    const handleClickOpenEdit = (event) => {
        const main = JSON.parse(event.currentTarget.attributes.objectid.textContent);
        setMainId(main);
        setMainObjectiveTitle(main.title);
        setMainObjectiveDescription(main.description);
        setOpenFormEdit(true);
    }

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        if(mainObjectiveTitle !== '' && mainObjectiveDescription !== '') {
            editTeam(
                {
                    objective: mainId,
                    title: mainObjectiveTitle,
                    description: mainObjectiveDescription
                },
                (response) => {
                    setRender(render - 1);
                },
                token,
                (error) => errorFunction(error)
            );
            setOpenFormEdit(false);
        } else {
            if(mainObjectiveTitle === '') {
                setErrorMainObjectiveTitle("Title cannot be empty");
            }
            if(mainObjectiveDescription === '') {
                setErrorMainObjectiveDescription("Description cannot be empty");
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(mainObjectiveTitle !== '' && mainObjectiveDescription !== '') {
            addMain(
                {
                    title: mainObjectiveTitle,
                    description: mainObjectiveDescription
                },
                () => {
                    setOpenSnackbarSuccess(true);
                    setRender(render - 1);
                },
                token,
                (error) => {
                    errorFunction(error);
                    setOpenSnackbarError(true)
                });
            handleCloseForm();
        } else {
            if(mainObjectiveTitle === '') {
                setErrorMainObjectiveTitle("Title cannot be empty");
            }
            if(mainObjectiveDescription === '') {
                setErrorMainObjectiveDescription("Description cannot be empty");
            }
        }
    };

    function isNaturalNumber(n) {
        n = n.toString();
        let n1 = Math.abs(n), n2 = parseInt(n, 10);
        return !isNaN(n1) && n2 === n1 && n1.toString() === n && n1 !== 0;
    }

    const handleSubmitSecond = (event) => {
        event.preventDefault();
        if(mainObjectiveTitle !== '' &&
            isNaturalNumber(secondTarget) &&
            secondTargetUnit!== '' &&
            !isNaN(Date.parse(date)) &&
            new Date(date).getTime() > new Date(new Date().toJSON().slice(0,10).replace(/-/g,'/')).getTime()) {
            addSecondary(
                {
                    title: mainObjectiveTitle,
                    target: secondTarget,
                    targetUnitMeasure: secondTargetUnit,
                    mainObjective: mainId,
                    deadline: date
                },
                () => {
                    setOpenSnackbarSuccess(true);
                    setRender(render + 1);
                },
                token,
                (error) => {
                    errorFunction(error);
                    setOpenSnackbarError(true)
                });
            handleCloseFormSecond();
        } else {
            if(mainObjectiveTitle === '') {
                setErrorMainObjectiveTitle("Description cannot be empty");
            }
            if(secondTargetUnit === '') {
                setErrorSecondObjectiveTargetUnit("Target unit cannot be empty");
            }
            if(!isNaturalNumber(secondTarget)) {
                setErrorSecondObjectiveTarget("Target is not valid");
            }
            if(isNaN(Date.parse(date)) || new Date(date).getTime() <= new Date(new Date().toJSON().slice(0,10).replace(/-/g,'/')).getTime()) {
                setErrorDeadline('Invalid deadline');
            }
        }
    };

    const handleSubmitThird = (event) => {
        event.preventDefault();
        sliders?.forEach(slider => {
            mainId.secondary?.forEach(goal => {
                if(slider._id === goal._id && slider.progress !== goal.progress) {
                    editProgress(
                        {
                            objective: goal,
                            progress: slider.progress
                        },
                        (response) => {
                            setRender(render + 1);
                        },
                        token,
                        (error) => errorFunction(error)
                    );
                }
            })
        })
        handleCloseFormThird();
    }

    useEffect(() => {
        setNumberOfPagesPersonalObjectives(Math.ceil(mainPersonalObjectives.length/OBJECTIVES_PER_PAGE));
    }, [mainPersonalObjectives]);

    useEffect(() => {
        setNumberOfPagesTeamObjectives(Math.ceil(mainTeamObjectives.length/OBJECTIVES_PER_PAGE));
    }, [mainTeamObjectives]);

    useEffect(() => {
        getMainObjectives(
            async response => {
                const mainPersObjectives = response.data;
                mainPersObjectives.forEach(main => {
                    main["secondary"] = [];
                    getSecondaryObjectives(
                        main._id,
                        (response) => {
                            main["secondary"] = main["secondary"].concat(response.data);
                            main["progress"] = getProgress(main);
                        },
                        token,
                        (error) => errorFunction(error)
                    )
                })
                setMainPersonalObjectives(mainPersObjectives);
            },
            token,
            (error) => errorFunction(error)
        );
        getTeamMainObjectives(
            response => {
                setIsManager(response.data["isManager"]);
                const teamObjectives = response.data["objectives"]
                teamObjectives.forEach(main => {
                    main["secondary"] = [];
                    getTeamSecondaryObjectives(
                        main._id,
                        (response) => {
                            main["secondary"] = main["secondary"].concat(response.data["objectives"]);
                            main["progress"] = getProgress(main);
                            setMainTeamObjectives(teamObjectives);
                        },
                        token,
                        (error) => errorFunction(error)
                    );
                })
            },
            token,
            (error) => errorFunction(error)
        );
        setLoading(false);
    }, [render]);

    useEffect(() => {
        setPage('Objectives');
    }, []);

    return(
        <Box component="main" sx={{
            flexGrow: 1,
            p: 3
        }}>
            <Toolbar/>
            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    {/* Add objective button */}
                    <Grid item sm={12}>
                        <Button startIcon={<AddTaskTwoTone/>} variant={"contained"} onClick={() => setOpenForm(true)}> New objective</Button>
                    </Grid>
                    {/* Objetives tabs */}
                    <Grid item sm={12}>
                        <Tabs value={tab} textColor='primary' variant="fullWidth" centered selectionFollowsFocus onChange={(event, newTab) => setTab(newTab)} aria-label="basic tabs example">
                            <Tab sx={{ fontSize: 18 }} icon={<TrackChangesTwoTone />} iconPosition="start" label="My Objectives"/>
                            {isManager === true ? <Tab sx={{ fontSize: 18 }} icon={<GroupWorkTwoTone />} iconPosition="start" label="Team Objectives"/> : null}
                        </Tabs>
                    </Grid>
                    <TabPanel value={tab} index={0} sx={{ display: 'flex', alignItems: 'center' }}>
                        {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                            <Grid container spacing={2} sx={{height: 600}}>
                                {mainPersonalObjectives.length > 0 ? mainPersonalObjectives
                                    .sort((a, b) => (a.status === 1 && b.status !== 1) ? -1 : 1)
                                    .slice((pagePersonalObjectives - 1) * OBJECTIVES_PER_PAGE, pagePersonalObjectives * OBJECTIVES_PER_PAGE)
                                    .map((objective) =>(
                                        <Grid item sm={12} key={objective._id}>
                                            <Card sx={{
                                                width: 1100,
                                                border: 2,
                                                borderColor: objective.status === 0 ? 'black' : (objective.status === 1 ? '#C1121F' : 'green'),
                                                position: 'relative',
                                            }}>
                                                <CardContent>
                                                    <Box sx={{display: "flex"}}>
                                                        <Typography noWrap sx={{ fontSize: 17, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div">
                                                            {objective.title}
                                                        </Typography>
                                                        <Typography component="div" sx={{
                                                            color: objective.status === 0 ? 'black' : (objective.status === 1 ? '#C1121F' : 'green'),
                                                        }}>
                                                            {objective.status === 0 ? 'Not Started' : (objective.status === 1 ? 'In progress' : 'Done')}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{display: "flex"}}>
                                                        <Typography noWrap sx={{ fontSize: 20, marginRight: 'auto', maxWidth: 900 }} component="div">
                                                            {objective.description}
                                                        </Typography>
                                                        <Button
                                                            sx={{
                                                                color: 'black',
                                                                display: (objective.status > 1) ? 'none' : 'flex'
                                                            }}
                                                            variant={"outlined"}
                                                            startIcon={<AddTaskTwoTone/>}
                                                            onClick={handleClickOpenFormSecond}
                                                            objectid={JSON.stringify(objective)}
                                                        >
                                                            Goals
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                                {objective.secondary.length > 0 ?
                                                    <CardActions sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Button
                                                            disabled={!getMarkDone(objective)}
                                                            color='success'
                                                            objectid={JSON.stringify(objective)}
                                                            onClick={() => handleMarkDone(objective)}
                                                            sx={{
                                                                display: (objective.status === 1) ? 'flex' : 'none'
                                                            }}
                                                        >
                                                            Mark Done
                                                        </Button>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                                    <LinearProgress variant="determinate" value={parseFloat(objective.progress)} color={objective.status === 1 ? 'progress' : 'success'}/>
                                                                </Box>
                                                                <Box sx={{ minWidth: 35 }}>
                                                                    <Typography variant="body2" sx={{
                                                                        color: objective.status === 0 ? 'black' : (objective.status === 1 ? '#C1121F' : 'green'),
                                                                    }}>{objective.progress}%</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={handleClickOpenFormThird}
                                                            objectid={JSON.stringify(objective)}
                                                            sx={{
                                                                display: (objective.status === 1) ? 'flex' : 'none'
                                                            }}
                                                        >
                                                            Progress
                                                        </Button>
                                                    </CardActions> : null}
                                            </Card>
                                        </Grid>
                                    )) : null}
                            </Grid>
                        }
                        <Box py={1} display="flex" justifyContent="center">
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
                            <Grid container spacing={2} sx={{height: 600}}>
                                {mainTeamObjectives.length > 0 ? mainTeamObjectives
                                    .sort((a, b) => (a.status === 1 && b.status !== 1) ? -1 : ((a.status < b.status) ? -1 : 1))
                                    .slice((pageTeamObjectives - 1) * OBJECTIVES_PER_PAGE, pageTeamObjectives * OBJECTIVES_PER_PAGE)
                                    .map((objective) =>(
                                        <Grid item sm={12} key={objective._id}>
                                            <Card sx={{
                                                width: 1100,
                                                border: 2,
                                                borderColor: objective.status === 0 ? 'black' : (objective.status === 1 ? '#C1121F' : 'green'),
                                                position: 'relative',
                                            }}>
                                                <CardContent>
                                                    <Box sx={{display: "flex"}}>
                                                        <Typography noWrap sx={{ fontSize: 17, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div">
                                                            {objective.title +  ' of ' + objective.user.displayName}
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: objective.status === 0 ? 'black' : (objective.status === 1 ? '#C1121F' : 'green'),
                                                        }}>
                                                            {objective.status === 0 ? 'Not started' : (objective.status === 1 ? 'In progress' : 'Done')}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{display: "flex"}}>
                                                        <Typography noWrap sx={{ fontSize: 20, marginRight: 'auto', maxWidth: 900 }} component="div">
                                                            {objective.description}
                                                        </Typography>
                                                        {objective.status === 1 ? <Button sx={{
                                                            color: 'primary'
                                                        }} variant={"outlined"} startIcon={<EditTwoTone/>} onClick={handleClickOpenEdit} objectid={JSON.stringify(objective)}>
                                                            Edit
                                                        </Button> : null}
                                                    </Box>
                                                </CardContent>
                                                {objective.secondary.length > 0 ?
                                                    <CardActions sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                                    <LinearProgress variant="determinate" value={parseFloat(objective.progress)} color={objective.status === 1 ? 'progress' : 'success'}/>
                                                                </Box>
                                                                <Box sx={{ minWidth: 35 }}>
                                                                    <Typography variant="body2" sx={{
                                                                        color: objective.status === 0 ? 'black' : (objective.status === 1 ? '#C1121F' : 'green'),
                                                                    }}>{objective.progress}%</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </CardActions> : null}
                                            </Card>
                                        </Grid>
                                    )) : null}
                            </Grid>
                        }
                        <Box py={1} display="flex" justifyContent="center">
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
            <Dialog open={openForm} fullWidth maxWidth={"md"}>
                <form
                    id="myform"
                    onSubmit={handleSubmit}
                >
                    <DialogTitle variant="h6">Add a main objective</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please write the title and a detailed description of the main Objective
                        </DialogContentText>
                        <br/>
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
            <Dialog open={openFormSecond} fullWidth maxWidth={"lg"}>
                <form
                    id="myformSecond"
                    onSubmit={handleSubmitSecond}
                >
                    <DialogTitle variant="h6">Add a secondary objective</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please write the title of the goal. Choose a unit measure with its target and deadline.
                        </DialogContentText>
                        <br/>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="secondTitle"
                            label="Secondary Objective Title"
                            type="text"
                            fullWidth
                            multiline
                            maxRows={4}
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
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <TextField
                                margin="dense"
                                label="Target Measure Units"
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
            <Dialog open={openFormThird} fullWidth maxWidth={"lg"}>
                <form
                    id="myformThird"
                    onSubmit={handleSubmitThird}
                >
                    <DialogTitle variant="h6">{mainId.title}</DialogTitle>
                    <DialogContent>
                        <Typography sx={{fontSize: 25}}>
                            {mainId.description}
                        </Typography>
                        <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {mainId.secondary?.map((goal, index) => (
                                    <div key={goal._id}>
                                        <br/>
                                        <Box sx={{display: "flex", justifyContent: 'space-between'}}>
                                            <Typography
                                                component="div"
                                                color="primary"
                                                sx={{fontSize: 20, maxWidth: 600}}
                                            >
                                                {goal.title}
                                            </Typography>
                                            {getDaysDifference(goal.deadline) < 0 ?
                                                <Typography color='error'>
                                                    Past due days {Math.ceil(Math.abs(getDaysDifference(goal.deadline))) - 1}
                                                </Typography> :
                                                <Typography color='success'>
                                                    Due in {Math.ceil(Math.abs(getDaysDifference(goal.deadline)))} days
                                                </Typography>
                                            }
                                            <Box sx={{display: "flex", justifyContent: 'space-between', width: 600}}>
                                                <Slider
                                                    disabled={getDaysDifference(goal.deadline) < 0 || goal.status > 1}
                                                    valueLabelDisplay={"on"}
                                                    value={sliders[index]?.progress || 0}
                                                    onChange={(event, newValue) => setSliders(sliders?.map((slider, index2) =>
                                                        index2 === index ? {...slider, progress: newValue} : {...slider}
                                                    ))}
                                                    marks
                                                    defaultValue={goal.progress}
                                                    step={1}
                                                    max={goal.target}
                                                    sx={{maxWidth: 400, m: 1}}
                                                />
                                                <Typography>
                                                    {goal.target + ' ' + goal.targetUnitMeasure}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <br/>
                                        <Divider/>
                                    </div>
                                )
                            )}
                        </List>
                    </DialogContent>
                    <DialogActions sx={{display: 'flex'}}>
                        <Button variant={"contained"} color='error' onClick={handleCloseFormThird} sx={{marginRight: 'auto'}}>Cancel</Button>
                        <Button type="submit" variant={"contained"} color={'success'} form="myformThird">Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={openFormEdit} fullWidth maxWidth={"lg"}>
                <DialogTitle variant="h6">{'Edit ' + mainId.title + ' of ' + mainId.user?.displayName}</DialogTitle>
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
                    <Button variant={"contained"} color='error' onClick={() => setOpenFormEdit(false)} sx={{marginRight: 'auto'}}>Cancel</Button>
                    <Button onClick={handleSubmitEdit} variant={"contained"} color={'success'}>Save</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbarSuccess} autoHideDuration={6000} onClose={handleCloseSnackbarSuccess}>
                <Alert onClose={handleCloseSnackbarSuccess} severity="success" sx={{ width: '100%' }}>
                    Objective added successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={openSnackbarError} autoHideDuration={6000} onClose={handleCloseSnackbarError}>
                <Alert onClose={handleCloseSnackbarError} severity="error" sx={{ width: '100%' }}>
                    Objective add failed!
                </Alert>
            </Snackbar>
        </Box>
    )
}