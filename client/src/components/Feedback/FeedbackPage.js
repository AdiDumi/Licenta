import React, {useEffect} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card, CardActionArea,
    CardContent, Checkbox,
    Container, createFilterOptions,
    CssBaseline,
    Dialog,
    DialogContentText, DialogTitle, FormControlLabel,
    FormGroup,
    Grid, Pagination, Paper, Radio, RadioGroup, Snackbar, Switch, Tab, Tabs,
    TextField, ToggleButton,
    Toolbar,
    Typography
} from "@mui/material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
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
import axios from "axios";
import {withStyles} from "tss-react/mui";
import {useNavigate} from "react-router-dom";

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

export default function Feedbacks({deleteToken, token}) {
    const navigate = useNavigate();
    const [errorMessageAutocomplete, setErrorMessageAutocomplete] = React.useState('');
    const [touchedAutocomplete, setTouchedAutocomplete] = React.useState(false);
    const [errorMessageField, setErrorMessageField] = React.useState('');
    const [isManager, setIsManager] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const [render, setRender] = React.useState('');
    const [selected, setSelected] = React.useState(false);
    const [openForm, setOpenForm] = React.useState(false);
    const [selectedFeedback, setSelectedFeedback] = React.useState('');
    const [openDialogFeedback, setOpenDialogFeedback] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
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

    const feedbacksPerPage = 9;

    const [companyEmployees, setCompanyEmployees] = React.useState([]);

    const [checkboxValue, setCheckboxValue] = React.useState("off");
    const [selectedEmployee, setSelectedEmployee] = React.useState("");
    const [feedbackMessage, setFeedbackMessage] = React.useState("");

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const handleClickOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setCheckboxValue("off");
        setFeedbackType('good');
        setSelectedEmployee('');
        setFeedbackMessage('');
        setChecked(false);
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
        setOpenDialogFeedback(false);
        if(!selectedFeedback.seen) {
            axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/markAsSeen',
                {
                    _id: selectedFeedback._id
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                console.log(response.data);
            })
        }
        if(selected || !selectedFeedback.seen)
            setRender(selectedFeedback._id + Math.random(50));
        setSelected(false);
        setSelectedFeedback('');
    };

    const handleUpdateFeed = () => {
        if(selected) {
            axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/markAsLiked',
                {
                    _id: selectedFeedback._id
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                console.log(response.data);
            })
        }
        handleCloseFeedback();
    };

    const handleChangeRadio = (event) => {
        setFeedbackType(event.target.value);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInputChange = (event, newSelectedEmployee) => {
        setSelectedEmployee(newSelectedEmployee);
        setErrorMessageAutocomplete('');
        setTouchedAutocomplete(true);
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/teamUsers', {
            params: {
                username: newSelectedEmployee
            },
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            let list1 = response.data;
            if(list1.length > 0)
                list1.forEach(teammate => teammate["team"]=true);
            axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/otherUsers', {
                params: {
                    username: newSelectedEmployee
                },
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                let list2 = response.data;
                if(list2.length > 0)
                    list2.forEach(user => user["team"]=false);
                setCompanyEmployees(list1.concat(list2).map((option) => {
                    return {
                        first: option.team ? 'Team' : 'Others',
                        ...option,
                    }
                }));
            }).catch(error => {
                if(error.response.data.error === 'Authentification failed. Check secret token.') {
                    deleteToken();
                    navigate("/");
                }
            })
        }).catch(error => {
            if(error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var typeFeed = 2, anonym = false;
        if (feedbackType === 'good') {
            typeFeed = 1;
        }
        if (checkboxValue === "on") {
            anonym = true;
        }
        if(feedbackMessage !== '' && selectedEmployee !== '') {
            axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/add',
                {
                    manager: selectedEmployee,
                    receiver: selectedEmployee,
                    message: feedbackMessage,
                    type: typeFeed,
                    anonymous: anonym
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                console.log(response.data);
                setRender(selectedEmployee);
                setOpenSnackbar(true);
            })
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
        setNumberOfPagesReceivedFeedbacks(Math.ceil(receivedFeedbacks.length/feedbacksPerPage));
    }, [receivedFeedbacks]);

    useEffect(() => {
        setNumberOfPagesSentFeedbacks(Math.ceil(sentFeedbacks.length/feedbacksPerPage));
    }, [sentFeedbacks]);

    useEffect(() => {
        setNumberOfPagesTeamFeedbacks(Math.ceil(teamFeedbacks.length/feedbacksPerPage));
    }, [teamFeedbacks]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/team', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setIsManager(response.data['isManager'])
            setTeamFeedbacks(response.data['teamFeedback']);
        }).catch(error => {
            if(error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        })
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/recv', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setReceivedFeedbacks(response.data);
        }).catch(error => {
            if(error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        })
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/sent', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setSentFeedbacks(response.data);
        }).catch(error => {
            if(error.response.data.error === 'Authentification failed. Check secret token.') {
                deleteToken();
                navigate("/");
            }
        })
        axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/manager', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            if(error.response.data.error === 'Authentification failed. Check secret token.') {
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
                        {/* Feedbacks button */}
                        <Grid item sm={12}>
                            <Button startIcon={<AddComment/>} variant={"contained"} onClick={handleClickOpenForm}> Give Feedback</Button>
                        </Grid>
                        {/* Feedbacks tabs */}
                        <Grid item sm={12}>
                            <Tabs value={tab} textColor='primary' variant="fullWidth" centered selectionFollowsFocus onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab sx={{ fontSize: 18 }} icon={<MoveToInboxTwoTone />} iconPosition="start" label="Received Feedbacks"/>
                                <Tab sx={{ fontSize: 18 }} icon={<OutboxTwoTone />} iconPosition="start" label="Sent Feedbacks"/>
                                {isManager === true ? <Tab sx={{ fontSize: 18 }} icon={<GroupTwoTone />} iconPosition="start" label="Team Feedbacks"/> : null }
                            </Tabs>
                            <TabPanel value={tab} index={0}>
                                <Grid container spacing={2} sx={{height: 540}}>
                                    {receivedFeedbacks.length > 0 ? receivedFeedbacks
                                        .sort((a, b) => (a.seen > b.seen) ? 1 : (a.seen === b.seen) ? ((new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1) : -1)
                                        .slice((pageReceivedFeedbacks - 1) * feedbacksPerPage, pageReceivedFeedbacks * feedbacksPerPage)
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
                                                                bottom: '90px',
                                                                color: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black'
                                                            }}/>
                                                            : null
                                                        }
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
                                </Grid>
                                <Box py={1} display="flex" justifyContent="center" sx={{ position: 'relative', left: '-16px', width: 1137}}>
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
                                <Grid container spacing={2} sx={{ height: 540}}>
                                    {sentFeedbacks.length > 0 ? sentFeedbacks
                                        .sort((a, b) => (new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1)
                                        .slice((pageSentFeedbacks - 1) * feedbacksPerPage, pageSentFeedbacks * feedbacksPerPage)
                                        .map(feedback => (
                                            <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                                <Card sx={{
                                                    minWidth: 275,
                                                    border: 4,
                                                    borderColor: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                    position: 'relative'
                                                }} >
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div">
                                                            To: <Typography sx={{textDecoration: 'underline', fontSize: 17}} display="inline" color="text.primary">{feedback.receiver}</Typography>
                                                            {feedback.appreciated === true ?
                                                                <ThumbUp sx={{
                                                                    position: 'absolute',
                                                                    left: '300px',
                                                                    color: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                                }}/>
                                                                : null}
                                                        </Typography>
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
                                </Grid>
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
                                <Grid container spacing={2} sx={{ height: 540}}>
                                    {teamFeedbacks.length > 0 ? teamFeedbacks
                                        .sort((a, b) => (new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1)
                                        .slice((pageTeamFeedbacks - 1) * feedbacksPerPage, pageTeamFeedbacks * feedbacksPerPage)
                                        .map(feedback => (
                                            <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                                <Card sx={{
                                                    minWidth: 275,
                                                    border: 3,
                                                    borderColor: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                    position: 'relative'
                                                }} >
                                                    <CardContent>
                                                        {feedback.anonymous === true ?
                                                            <Typography sx={{ fontSize: 16 }} color="text.secondary" component="div">
                                                                From anonymous
                                                            </Typography> :
                                                            <Typography sx={{ fontSize: 16 }} color="text.secondary" component="div"> From:
                                                                <Typography sx={{textDecoration: 'underline', fontSize: 16}} display="inline" color="text.primary">
                                                                    {feedback.reporter}
                                                                </Typography>
                                                            </Typography>
                                                        }
                                                        <Typography sx={{ fontSize: 16 }} color="text.secondary" component="div">
                                                            To: <Typography sx={{textDecoration: 'underline', fontSize: 16}} display="inline" color="text.primary">{feedback.receiver}</Typography>
                                                            {feedback.appreciated === true ?
                                                                <ThumbUp sx={{
                                                                    position: 'absolute',
                                                                    left: '300px',
                                                                    color: (feedback.type === 1) ? '#0053A0' : (feedback.type === 2) ? '#EFA825' : 'black',
                                                                }}/>
                                                                : null}
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
                                </Grid>
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
                <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth={"md"}>
                    <form
                        onSubmit={handleSubmit}
                        id="myform"
                    >
                        <DialogTitle variant="h6">Give Feedback</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please write a constructive feedback
                            </DialogContentText>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox onClick={e => setCheckboxValue(e.target.value)}/>} label="Anonymous" />
                                <FormControlLabel control={<Switch icon={<VisibilityOff/>} checkedIcon={<Visibility/>} checked={checked} onChange={e => setChecked(e.target.checked)}/>} label={checked ? "visible for team lead" : "not visible for team lead"}/>
                            </FormGroup>
                            <Typography>Feedback type:</Typography>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={feedbackType}
                                onChange={handleChangeRadio}
                            >
                                <FormControlLabel value="good" control={<Radio />} label="Good" />
                                <FormControlLabel value="improve" control={<Radio />} label="Improve" />
                            </RadioGroup>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={companyEmployees.sort((a,b) => b.first.localeCompare(a.first))}
                                getOptionLabel={(option) => option.uid}
                                groupBy={(option) => option.first}
                                sx={{ width: 300 }}
                                inputValue={selectedEmployee}
                                onInputChange={handleInputChange}
                                onClose={e => setTouchedAutocomplete(false)}
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
                        <DialogActions >
                            <Button variant={"contained"} color='error' onClick={handleCloseForm} sx={{align: 'left'}}>Cancel</Button>
                            <Button type="submit" variant={"contained"} form="myform">Send</Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={openDialogFeedback} onClose={handleCloseFeedback}  fullWidth maxWidth={"md"}>
                    <Paper
                        sx={{
                            border: 3,
                            borderColor: (selectedFeedback.type === 1) ? '#2196f3' : (selectedFeedback.type === 2) ? 'yellow' : 'black',
                            position: 'relative'
                        }}
                    >
                    <DialogTitle variant="h6">
                        Feedback from {selectedFeedback.reporter}
                        <ToggleButton
                            value="check"
                            color="primary"
                            selected={selectedFeedback.appreciated === true ? true : selected}
                            onChange={() => {
                                setSelected(!selected);
                            }}
                            sx={{
                                position: 'absolute',
                                left: '650px',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}>
                                <span>Appreciate feedback </span>
                                <ThumbUp/>
                            </div>
                        </ToggleButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            On {new Date(selectedFeedback.receivedDate).toDateString()}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Feedback Message"
                            type="text"
                            fullWidth
                            multiline
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                            value={selectedFeedback.message}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateFeed} variant={"contained"}>Save</Button>
                    </DialogActions>
                    </Paper>
                </Dialog>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Feedback sent successfully!
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}