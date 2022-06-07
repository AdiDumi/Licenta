import React, {useEffect} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card, CardActionArea,
    CardContent, Checkbox,
    Container, createTheme,
    CssBaseline,
    Dialog,
    DialogContentText, DialogTitle, FormControlLabel,
    FormGroup,
    Grid, Pagination, Paper, Radio, RadioGroup, Snackbar, Tab, Tabs,
    TextField, ToggleButton,
    Toolbar,
    Typography
} from "@mui/material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
import MuiAlert from '@mui/material/Alert';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import {AddComment, Inbox, Outbox, ThumbUp} from "@mui/icons-material";
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
    const [receivedFeedbacks, setReceivedFeedbacks] = React.useState([]);
    const [sentFeedbacks, setSentFeedbacks] = React.useState([]);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        var typeFeed = 2, anonym = false;
        if (feedbackType === 'good') {
            typeFeed = 1;
        }
        if (checkboxValue === "on") {
            anonym = true;
        }
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
        })
        setCheckboxValue("off");
        setFeedbackType('good');
        setSelectedEmployee('');
        setFeedbackMessage('');
        setOpenForm(false);
        setOpenSnackbar(true);
    };

    useEffect(() => {
        setNumberOfPagesReceivedFeedbacks(Math.ceil(receivedFeedbacks.length/feedbacksPerPage));
    }, [receivedFeedbacks]);

    useEffect(() => {
        setNumberOfPagesSentFeedbacks(Math.ceil(sentFeedbacks.length/feedbacksPerPage));
    }, [sentFeedbacks]);

    useEffect(() => {
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
        setCompanyEmployees([
            { label: 'cn=admin,dc=grow,dc=app'},
            { label: 'cn=developer,dc=grow,dc=app'},
        ]);
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
                <Container maxWidth="lg" sx={{ backgroundColor: '#FFFFFF', }}>
                    <Grid container spacing={1}>
                        {/* Feedbacks button */}
                        <Grid item sm={12}>
                            <Button startIcon={<AddComment/>} variant={"contained"} onClick={handleClickOpenForm}> Give Feedback</Button>
                        </Grid>
                        {/* Feedbacks tabs */}
                        <Grid item sm={12}>
                            <Tabs value={tab} variant="fullWidth" centered selectionFollowsFocus onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab sx={{ fontSize: 18 }} icon={<Inbox />} iconPosition="start" label="Received Feedbacks"/>
                                <Tab sx={{ fontSize: 18 }} icon={<Outbox />} iconPosition="start" label="Sent Feedbacks"/>
                            </Tabs>
                            <TabPanel value={tab} index={0}>
                                <Grid container spacing={2} sx={{backgroundColor: '#c4ffc2'}}>
                                    {receivedFeedbacks.length > 0 ? receivedFeedbacks
                                        .sort((a, b) => (a.seen > b.seen) ? 1 : (a.seen === b.seen) ? ((new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1) : -1)
                                        .slice((pageReceivedFeedbacks - 1) * feedbacksPerPage, pageReceivedFeedbacks * feedbacksPerPage)
                                        .map(feedback => (
                                        <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                            {feedback.seen === false ? <Typography sx={{ color: 'red' }}>New</Typography> : <Typography> &nbsp; </Typography>}
                                            <Card sx={{
                                                border: 3,
                                                borderColor: (feedback.type === 1) ? '#2196f3' : (feedback.type === 2) ? 'yellow' : 'black',
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
                                                                color: (feedback.type === 1) ? '#2196f3' : (feedback.type === 2) ? 'yellow' : 'black'
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
                                <Box py={1} display="flex" justifyContent="center" sx={{ position: 'relative', left: '-16px', width: 1135, backgroundColor: '#c4ffc2'}}>
                                    <Pagination
                                        onChange={(e, value) => {
                                            setPageReceivedFeedbacks(value)
                                        }}
                                        style={{
                                            justifyContent: "center",
                                        }}
                                        page={pageReceivedFeedbacks}
                                        color="primary"
                                        count={numberOfPagesReceivedFeedbacks}/>
                                </Box>
                            </TabPanel>
                            <TabPanel value={tab} index={1}>
                                <Grid container spacing={3} sx={{backgroundColor: '#c4ffc2'}}>
                                    {sentFeedbacks.length > 0 ? sentFeedbacks
                                        .sort((a, b) => (new Date(a.receivedDate).getTime() < new Date(b.receivedDate).getTime()) ? 1 : -1)
                                        .slice((pageSentFeedbacks - 1) * feedbacksPerPage, pageSentFeedbacks * feedbacksPerPage)
                                        .map(feedback => (
                                            <Grid item xs={"auto"} sm={6} md={4} key={feedback._id}>
                                                <Card sx={{
                                                    minWidth: 275,
                                                    border: 3,
                                                    borderColor: (feedback.type === 1) ? '#2196f3' : (feedback.type === 2) ? 'yellow' : 'black',
                                                    position: 'relative'
                                                }} >
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div">
                                                            To: <Typography sx={{textDecoration: 'underline', fontSize: 18}} display="inline" color="text.primary">{feedback.receiver}</Typography>
                                                            {feedback.appreciated === true ?
                                                                <ThumbUp sx={{
                                                                    position: 'absolute',
                                                                    left: '300px',
                                                                    color: (feedback.type === 1) ? '#2196f3' : (feedback.type === 2) ? 'yellow' : 'black',
                                                                }}/>
                                                                : null}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 15 }} variant="subtitle2" color="text.secondary" gutterBottom>
                                                            On {new Date(feedback.receivedDate).toDateString()} {feedback.anonymous === true ? 'as anonymous' : ' '}
                                                        </Typography>
                                                        <Typography noWrap sx={{ fontSize: 30 }} component="div">
                                                            {feedback.message}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )) : <Typography> You have no sent feedbacks </Typography>}
                                </Grid>
                                <Box py={1} display="flex" justifyContent="center" sx={{ position: 'relative', left: '-19px', width: 1140, backgroundColor: '#c4ffc2'}}>
                                    <Pagination
                                        onChange={(e, value) => setPageSentFeedbacks(value)}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                        page={pageSentFeedbacks}
                                        color="primary"
                                        count={numberOfPagesSentFeedbacks}/>
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Container>
                <Dialog open={openForm} onClose={handleCloseForm}  fullWidth maxWidth={"md"}>
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
                                options={companyEmployees}
                                sx={{ width: 300 }}
                                inputValue={selectedEmployee}
                                onInputChange={(event, newSelectedEmployee) => {
                                    setSelectedEmployee(newSelectedEmployee);
                                }}
                                renderInput={(params) => <TextField {...params} label="To" />}
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
                                onChange={e => setFeedbackMessage(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant={"contained"} onClick={handleCloseForm}>Cancel</Button>
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
                        <Button onClick={handleUpdateFeed} variant={"outlined"}>Save</Button>
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