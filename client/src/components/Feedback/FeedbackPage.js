import React, {useEffect} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card, CardActionArea,
    CardContent, Checkbox,
    Container,
    Dialog,
    DialogContentText, DialogTitle, FormControlLabel,
    FormGroup,
    Grid, Pagination, Paper, Radio, RadioGroup, Skeleton, Snackbar, Switch, Tab, Tabs,
    TextField, ToggleButton,
    Toolbar,
    Typography
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import {
    AddComment, GroupTwoTone,
    MoveToInboxTwoTone,
    OutboxTwoTone,
    ThumbUp,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import {withStyles} from "tss-react/mui";
import {useNavigate} from "react-router-dom";
import {addFeedback, getTeamFeedbacks, getReceivedFeedbacks, getSentFeedbacks, markFeedbackAsLiked, markFeedbackAsSeen} from "../../api/feedbacksApi";
import {getManager, getOthers, getTeam} from '../../api/userApi'
import {FEEDBACKS_PER_PAGE} from "../../constants/Constants";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DialogContent = withStyles(MuiDialogContent, theme => ({
    root: {
        padding: theme.spacing(2)
    }
}));

const DialogActions = withStyles(MuiDialogActions, theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1)
    }
}));

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

export default function Feedbacks({deleteToken, token, setPage}) {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [errorMessageAutocomplete, setErrorMessageAutocomplete] = React.useState('');
    const [touchedAutocomplete, setTouchedAutocomplete] = React.useState(false);
    const [errorMessageField, setErrorMessageField] = React.useState('');
    const [isManager, setIsManager] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const [render, setRender] = React.useState(0);
    const [selected, setSelected] = React.useState(false);
    const [openForm, setOpenForm] = React.useState(false);
    const [selectedFeedback, setSelectedFeedback] = React.useState('');
    const [openDialogFeedback, setOpenDialogFeedback] = React.useState(false);
    const [openSnackbarSuccess, setOpenSnackbarSuccess] = React.useState(false);
    const [openSnackbarError, setOpenSnackbarError] = React.useState(false);
    const [feedbackType, setFeedbackType] = React.useState('good');
    const [tab, setTab] = React.useState(0);
    const [pageReceivedFeedbacks, setPageReceivedFeedbacks] = React.useState(1);
    const [numberOfPagesReceivedFeedbacks, setNumberOfPagesReceivedFeedbacks] = React.useState(1);
    const [pageSentFeedbacks, setPageSentFeedbacks] = React.useState(1);
    const [numberOfPagesSentFeedbacks, setNumberOfPagesSentFeedbacks] = React.useState(1);
    const [pageTeamFeedbacks, setPageTeamFeedbacks] = React.useState(1);
    const [numberOfPagesTeamFeedbacks, setNumberOfPagesTeamFeedbacks] = React.useState(1);
    const [receivedFeedbacks, setReceivedFeedbacks] = React.useState([]);
    const [sentFeedbacks, setSentFeedbacks] = React.useState([]);
    const [teamFeedbacks, setTeamFeedbacks] = React.useState([]);
    const [companyEmployees, setCompanyEmployees] = React.useState([]);
    const [checkboxValue, setCheckboxValue] = React.useState("off");
    const [selectedEmployee, setSelectedEmployee] = React.useState("");
    const [feedbackMessage, setFeedbackMessage] = React.useState("");
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

    const handleCloseForm = () => {
        setCheckboxValue("off");
        setFeedbackType('good');
        setSelectedEmployee('');
        setFeedbackMessage('');
        setChecked(true);
        setErrorMessageField('');
        setTouchedAutocomplete(false);
        setErrorMessageAutocomplete('');
        setOpenForm(false);
    };

    const handleClickOpenFeedback = (event) => {
        setOpenDialogFeedback(true);
        setSelectedFeedback(JSON.parse(event.currentTarget.attributes.feedbackid.textContent));
    };

    const handleCloseFeedback = () => {
        if(typeof selectedFeedback !== 'undefined') {
            if (selected) {
                markFeedbackAsLiked(selectedFeedback._id, null, token, (error) => errorFunction(error));
            }
            if (!selectedFeedback.seen) {
                markFeedbackAsSeen(selectedFeedback._id, null, token, (error) => errorFunction(error));
            }
            if (selected || !selectedFeedback.seen)
                setRender(render + 1);
        }
        setOpenDialogFeedback(false);
        setSelected(false);
        setSelectedFeedback('');
    };

    const handleCloseSnackbarSuccess = () => {
        setOpenSnackbarSuccess(false);
    };

    const handleCloseSnackbarError = () => {
        setOpenSnackbarError(false);
    };

    const handleInputChange = (event, newSelectedEmployee) => {
        setSelectedEmployee(newSelectedEmployee);
        setErrorMessageAutocomplete('');
        setTouchedAutocomplete(true);
        getTeam(newSelectedEmployee,
            (response) => {
                let team = response.data;
                if (team.length > 0)
                    team.forEach(teammate => teammate["team"] = "Team");
                getOthers(newSelectedEmployee,
                    (response) => {
                        let others = response.data;
                        if (others.length > 0)
                            others.forEach(user => user["team"] = "Others");
                        getManager(
                            (response) => {
                                let manager = response.data;
                                if (manager !== 'OK') {
                                    manager["team"] = "Manager"
                                } else {
                                    manager = [];
                                }
                                if (team.length > 3)
                                    team = team.slice(0, 3);
                                if (others.length > 3)
                                    others = others.slice(0, 3);
                                setCompanyEmployees(team.concat(others).concat(manager));
                            },
                            token,
                            (error) => errorFunction(error)
                        )
                    },
                    token,
                    (error) => errorFunction(error)
                )
            },
            token,
            (error) => errorFunction(error)
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let typeFeed = 2, anonym = false;
        if (feedbackType === 'good') {
            typeFeed = 1;
        }
        if (checkboxValue === "on") {
            anonym = true;
        }
        const receiver = companyEmployees.find((employee) => employee.displayName === selectedEmployee);
        if(feedbackMessage !== '' && selectedEmployee !== '') {
            addFeedback(
                {
                    manager: selectedEmployee,
                    receiver: receiver,
                    message: feedbackMessage,
                    type: typeFeed,
                    anonymous: anonym,
                    visibleForManager: checked
                },
                (response) => {
                    setRender(render - 1);
                    setOpenSnackbarSuccess(true);
                },
                token,
                (error) => {
                    errorFunction(error);
                    setOpenSnackbarError(true);
                });
            handleCloseForm();
        } else {
            if(feedbackMessage === '') {
                setErrorMessageField("Feedback message can't be empty");
            }
            if(selectedEmployee === '') {
                setErrorMessageAutocomplete("The recipient can't be empty");
            }
        }
    };

    useEffect(() => {
        setNumberOfPagesReceivedFeedbacks(Math.ceil(receivedFeedbacks.length/FEEDBACKS_PER_PAGE));
    }, [receivedFeedbacks]);

    useEffect(() => {
        setNumberOfPagesSentFeedbacks(Math.ceil(sentFeedbacks.length/FEEDBACKS_PER_PAGE));
    }, [sentFeedbacks]);

    useEffect(() => {
        setNumberOfPagesTeamFeedbacks(Math.ceil(teamFeedbacks.length/FEEDBACKS_PER_PAGE));
    }, [teamFeedbacks]);

    useEffect(() => {
        getTeamFeedbacks(
            (response) => {
                setIsManager(response.data['isManager'])
                setTeamFeedbacks(response.data['teamFeedback']);
            },
            token,
            (error) => errorFunction(error)
        );
        getReceivedFeedbacks(
            (response) => {
                setReceivedFeedbacks(response.data);
            },
            token,
            (error) => errorFunction(error)
        );
        getSentFeedbacks(
            (response) => {
                setSentFeedbacks(response.data);
            },
            token,
            (error) => errorFunction(error)
        );
        setLoading(false);
    }, [render]);

    useEffect(() => {
        setPage('Feedbacks');
    }, []);

    return(
        <Box component="main" sx={{
            flexGrow: 1,
            p: 3
        }}>
            <Toolbar/>
            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    {/* Feedbacks button */}
                    <Grid item sm={12}>
                        <Button startIcon={<AddComment/>} variant={"contained"} onClick={() => setOpenForm(true)}> Give Feedback</Button>
                    </Grid>
                    {/* Feedbacks tabs */}
                    <Grid item sm={12}>
                        <Tabs value={tab} textColor='primary' variant="fullWidth" centered selectionFollowsFocus onChange={(event, newTab) => setTab(newTab)} aria-label="basic tabs example">
                            <Tab sx={{ fontSize: 18 }} icon={<MoveToInboxTwoTone />} iconPosition="start" label="Received Feedbacks"/>
                            <Tab sx={{ fontSize: 18 }} icon={<OutboxTwoTone />} iconPosition="start" label="Sent Feedbacks"/>
                            {isManager === true ? <Tab sx={{ fontSize: 18 }} icon={<GroupTwoTone />} iconPosition="start" label="Team Feedbacks"/> : null }
                        </Tabs>
                        <TabPanel value={tab} index={0}>
                            {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                <Grid container spacing={2} sx={{height: 540}}>
                                    {receivedFeedbacks.length > 0 ? receivedFeedbacks
                                        .sort((a, b) => (a.seen > b.seen) ? 1 : (a.seen === b.seen) ? ((new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1) : -1)
                                        .slice((pageReceivedFeedbacks - 1) * FEEDBACKS_PER_PAGE, pageReceivedFeedbacks * FEEDBACKS_PER_PAGE)
                                        .map(feedback => (
                                            <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                                {feedback.seen === false ? <Typography sx={{ color: '#E71523' }}>New</Typography> : <Typography> &nbsp; </Typography>}
                                                <Card sx={{
                                                    border: 3,
                                                    borderColor: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                    position: 'relative',
                                                }} >
                                                    <CardActionArea onClick={handleClickOpenFeedback} feedbackid={JSON.stringify(feedback)}>
                                                        <CardContent>
                                                            <Box sx={{display: "flex"}}>
                                                                {feedback.anonymous === true ?
                                                                    <Typography sx={{ fontSize: 17, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div">
                                                                        Anonymous
                                                                    </Typography> :
                                                                    <Typography sx={{ fontSize: 17, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div"> From:
                                                                        <Typography sx={{textDecoration: 'underline', fontSize: 18, marginRight: 'auto', maxWidth: 700}} display="inline" color="text.primary">
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
                                                            <Typography sx={{ fontSize: 15 }} variant="subtitle2" color="text.secondary" gutterBottom>
                                                                On {new Date(feedback.receivedDate).toDateString()}
                                                            </Typography>
                                                            <Typography noWrap sx={{ fontSize: 30 }} component="div">
                                                                {feedback.message}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        )) : <Typography> You have no received feedbacks </Typography>}
                                </Grid>}
                            <Box py={1} display="flex" justifyContent="center">
                                <Pagination
                                    onChange={(e, value) => {
                                        setPageReceivedFeedbacks(value)
                                    }}
                                    style={{
                                        justifyContent: "center",
                                        display: receivedFeedbacks.length > 0 ? "flex" : "none"
                                    }}
                                    page={pageReceivedFeedbacks}
                                    color="primary"
                                    count={numberOfPagesReceivedFeedbacks}/>
                            </Box>
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                <Grid container spacing={2} sx={{ height: 540}}>
                                    {sentFeedbacks.length > 0 ? sentFeedbacks
                                        .sort((a, b) => (new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1)
                                        .slice((pageSentFeedbacks - 1) * FEEDBACKS_PER_PAGE, pageSentFeedbacks * FEEDBACKS_PER_PAGE)
                                        .map(feedback => (
                                            <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                                <Card sx={{
                                                    minWidth: 275,
                                                    border: 4,
                                                    borderColor: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                    position: 'relative'
                                                }} >
                                                    <CardContent>
                                                        <Box sx={{display: "flex"}}>
                                                            <Typography sx={{ fontSize: 17, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div">
                                                                To: <Typography sx={{textDecoration: 'underline', fontSize: 17, marginRight: 'auto', maxWidth: 700}} display="inline" color="text.primary">{feedback.receiver.displayName}</Typography>
                                                            </Typography>
                                                            {feedback.appreciated === true ?
                                                                <ThumbUp sx={{
                                                                    color: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                                }}/>
                                                                : null}
                                                        </Box>
                                                        <Typography sx={{ fontSize: 16 }} variant="subtitle2" color="text.secondary" gutterBottom>
                                                            On {new Date(feedback.receivedDate).toDateString()} {feedback.anonymous === true ? 'as anonymous' : ' '}
                                                        </Typography>
                                                        <Typography noWrap sx={{ fontSize: 33 }} component="div">
                                                            {feedback.message}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )) : <Typography> You have no sent feedbacks </Typography>}
                                </Grid>}
                            <Box py={1} display="flex" justifyContent="center" sx={{ position: 'relative', left: '-16px', width: 1137}}>
                                <Pagination
                                    onChange={(e, value) => setPageSentFeedbacks(value)}
                                    style={{
                                        display: sentFeedbacks.length > 0 ? "flex" : "none",
                                        justifyContent: "center",
                                    }}
                                    page={pageSentFeedbacks}
                                    color="primary"
                                    count={numberOfPagesSentFeedbacks}/>
                            </Box>
                        </TabPanel>
                        <TabPanel value={tab} index={2}>
                            {loading ? <Skeleton variant={"rectangular"} width={1200} height={400}/> :
                                <Grid container spacing={2} sx={{ height: 540}}>
                                    {teamFeedbacks.length > 0 ? teamFeedbacks
                                        .sort((a, b) => (new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1)
                                        .slice((pageTeamFeedbacks - 1) * FEEDBACKS_PER_PAGE, pageTeamFeedbacks * FEEDBACKS_PER_PAGE)
                                        .map(feedback => (
                                            <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                                <Card sx={{
                                                    minWidth: 275,
                                                    border: 4,
                                                    borderColor: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                    position: 'relative'
                                                }} >
                                                    <CardContent>
                                                        <Box sx={{display: "flex"}}>
                                                            {feedback.anonymous === true ?
                                                                <Typography sx={{ fontSize: 16, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div">
                                                                    From anonymous
                                                                </Typography> :
                                                                <Typography sx={{ fontSize: 16, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div"> From:
                                                                    <Typography sx={{textDecoration: 'underline', fontSize: 16, marginRight: 'auto', maxWidth: 700}} display="inline" color="text.primary">
                                                                        {feedback.reporter.displayName}
                                                                    </Typography>
                                                                </Typography>
                                                            }
                                                            {feedback.appreciated === true ?
                                                                <ThumbUp sx={{
                                                                    color: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                                }}/>
                                                                : null}
                                                        </Box>
                                                        <Typography sx={{ fontSize: 16, marginRight: 'auto', maxWidth: 700 }} color="text.secondary" component="div">
                                                            To: <Typography sx={{textDecoration: 'underline', fontSize: 16, marginRight: 'auto', maxWidth: 700}} display="inline" color="text.primary">{feedback.receiver.displayName}</Typography>
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 14 }} variant="subtitle2" color="text.secondary" gutterBottom>
                                                            On {new Date(feedback.receivedDate).toDateString()}
                                                        </Typography>
                                                        <Typography noWrap sx={{ fontSize: 28 }} component="div">
                                                            {feedback.message}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )) : <Typography> Your team has no feedbacks </Typography>}
                                </Grid>}
                            <Box py={1} display="flex" justifyContent="center" sx={{ position: 'relative', left: '-16px', width: 1137}}>
                                <Pagination
                                    onChange={(e, value) => setPageTeamFeedbacks(value)}
                                    style={{
                                        display: teamFeedbacks.length > 0 ? "flex" : "none",
                                        justifyContent: "center",
                                    }}
                                    page={pageTeamFeedbacks}
                                    color="primary"
                                    count={numberOfPagesTeamFeedbacks}/>
                            </Box>
                        </TabPanel>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={openForm} fullWidth maxWidth={"md"}>
                <form
                    onSubmit={handleSubmit}
                    id="myform"
                >
                    <DialogTitle variant="h6">Give Feedback</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please write a constructive feedback. You can choose if you want to be anonymous, if you want to be seen by the recipient's manager and the type of it
                        </DialogContentText>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onClick={e => setCheckboxValue(e.target.value)}/>} label="Anonymous" />
                            <FormControlLabel control={<Switch icon={<VisibilityOff/>} checkedIcon={<Visibility/>} checked={checked} onChange={e => setChecked(e.target.checked)}/>} label={checked ? "visible for recipient's manager" : "not visible for recipient's manager"}/>
                        </FormGroup>
                        <br/>
                        <Typography>Feedback type:</Typography>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={feedbackType}
                            onChange={event => setFeedbackType(event.target.value)}
                        >
                            <FormControlLabel value="good" control={<Radio color='good'/>} label="Good"/>
                            <FormControlLabel value="improve" control={<Radio color='improve'/>} label="Improve"/>
                        </RadioGroup>
                        <br/>
                        <Autocomplete
                            disablePortal
                            autoComplete={true}
                            id="combo-box-demo"
                            options={companyEmployees.sort((a,b) => b.team.localeCompare(a.team))}
                            getOptionLabel={(option) => option.displayName}
                            groupBy={(option) => option.team}
                            sx={{ width: 300 }}
                            inputValue={selectedEmployee}
                            onInputChange={handleInputChange}
                            isOptionEqualToValue={(option, value) => option.displayName === value.displayName}
                            onClose={e => {
                                setTouchedAutocomplete(false)
                            }}
                            onOpen={e => handleInputChange(e, selectedEmployee)}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    onChange={e => {
                                        setErrorMessageAutocomplete(e.target.value)
                                    }}
                                    error={!touchedAutocomplete && errorMessageAutocomplete !== ''}
                                    helperText={!touchedAutocomplete && (errorMessageAutocomplete !== '' && errorMessageAutocomplete)}
                                    label="Recipient"
                                />}
                        />
                        <br/>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Feedback Message"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={feedbackMessage}
                            onChange={e => {
                                setFeedbackMessage(e.target.value)
                                setErrorMessageField('');
                            }}
                            error={errorMessageField !== ''}
                            helperText={errorMessageField !== '' && errorMessageField}
                        />
                    </DialogContent>
                    <DialogActions sx={{display: 'flex'}}>
                        <Button variant={"contained"} color='error' onClick={handleCloseForm} sx={{marginRight: 'auto'}}>Cancel</Button>
                        <Button type="submit" variant={"contained"} color={'success'} form="myform">Send</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={openDialogFeedback} fullWidth maxWidth={"md"}>
                <Paper
                    sx={{
                        border: 3,
                        borderColor: (selectedFeedback.type === 1) ? '#0053A0' : (selectedFeedback.type === 2) ? '#EFA825' : 'black',
                        position: 'relative'
                    }}
                >
                    <DialogTitle variant="h6">
                        Feedback from {selectedFeedback.anonymous ? 'Anonymous' : selectedFeedback.reporter?.displayName}
                        <ToggleButton
                            autoFocus
                            value="check"
                            disabled={selectedFeedback.appreciated === true}
                            selected={selectedFeedback.appreciated === true ? true : selected}
                            onChange={() => {
                                setSelected(!selected);
                            }}
                            color={(selectedFeedback.type === 1) ? 'good' : 'improve'}
                            sx={{
                                position: 'absolute',
                                left: '650px',
                            }}
                        >
                            <Grid container alignItems="center">
                                <Grid item>
                                    Appreciate feedback
                                </Grid>
                                <Grid item>
                                    <ThumbUp/>
                                </Grid>
                            </Grid>
                        </ToggleButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            On {new Date(selectedFeedback.receivedDate).toDateString()}
                        </DialogContentText>
                        <br/>
                        <Typography>
                            {selectedFeedback.message}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseFeedback} color={'error'} variant={"contained"}>Close</Button>
                    </DialogActions>
                </Paper>
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
    )
}