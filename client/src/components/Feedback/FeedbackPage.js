import React, {useEffect} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card, CardActionArea,
    CardContent, Checkbox,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControlLabel,
    FormGroup,
    Grid, Pagination, Radio, RadioGroup, Snackbar, Tab, Tabs,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
import MuiAlert from '@mui/material/Alert';
import {AddComment, Inbox, Outbox, ThumbUp} from "@mui/icons-material";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        value === index && (
            <Box sx={{ p: 3 }}>
                <Typography component={'div'}>{children}</Typography>
            </Box>
        )
    );
}

export default function Feedbacks({deleteToken}) {
    const [open, setOpen] = React.useState(false);
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeRadio = (event) => {
        setFeedbackType(event.target.value);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(checkboxValue);
        console.log(feedbackType);
        console.log(selectedEmployee);
        console.log(feedbackMessage);
        setCheckboxValue("off");
        setFeedbackType('good');
        setSelectedEmployee('');
        setFeedbackMessage('');
        setOpen(false);
        setOpenSnackbar(true);
    };

    useEffect(() => {
        setNumberOfPagesReceivedFeedbacks(Math.ceil(receivedFeedbacks.length/feedbacksPerPage));
    }, [receivedFeedbacks]);

    useEffect(() => {
        setNumberOfPagesSentFeedbacks(Math.ceil(sentFeedbacks.length/feedbacksPerPage));
    }, [sentFeedbacks]);

    useEffect(() => {
        setReceivedFeedbacks([
            {
                reporter: "Alin",
                message: "You did it!",
                date: "o data",
                type: "fasafaf",
                liked: 1
            },
            {
                reporter: "Aldi",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 1
            },
            {
                reporter: "Nico",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                reporter: "Alin2",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                reporter: "Aldi2",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                reporter: "Nico2",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                reporter: "Alin3",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                reporter: "Aldi3",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                reporter: "Nico3",
                message: "You did it! nafjwajdnaj wkdm kawdl mawk fmiawj dlamdli awmd ilawd ia",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                reporter: "Alin23",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                reporter: "Aldi23",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                reporter: "Nico23",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                reporter: "Alin4",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                reporter: "Aldi4",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                reporter: "Nico4",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                reporter: "Alin24",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                reporter: "Aldi24",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                reporter: "Nico24",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
        ]);
        setSentFeedbacks([
            {
                to: "Alin",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                to: "Aldi",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                to: "Nico",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                to: "Alin2",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                to: "Aldi2",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                to: "Nico2",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                to: "Alin3",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                to: "Aldi3",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                to: "Nico3",
                message: "You did it! nafjwajdnaj wkdm kawdl mawk fmiawj dlamdli awmd ilawd ia",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                to: "Alin23",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                to: "Aldi23",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                to: "Nico23",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                to: "Alin4",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 0
            },
            {
                to: "Aldi4",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                to: "Nico4",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                to: "Alin24",
                message: "You did it!",
                date: "o data",
                type: "good",
                liked: 1
            },
            {
                to: "Aldi24",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 1
            },
            {
                to: "Nico24",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
            {
                to: "Nico223134",
                message: "You did it!",
                date: "o data",
                type: "improve",
                liked: 0
            },
        ]);
        setCompanyEmployees([
            { label: 'The Shawshank Redemption'},
            { label: 'The Godfather'},
            { label: 'The Godfather: Part II'},
            { label: 'The Dark Knight' },
            { label: '12 Angry Men' },
            { label: "Schindler's List" },
            { label: 'Pulp Fiction' },
            { label: 'The Lord of the Rings: The Return of the King' },
            { label: 'The Good, the Bad and the Ugly' },
            { label: 'Fight Club' },
            { label: 'The Lord of the Rings: The Fellowship of the Ring' }
        ]);
    }, []);

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
                            <Button startIcon={<AddComment/>} variant={"contained"} onClick={handleClickOpen}> Give Feedback</Button>
                        </Grid>
                        {/* Feedbacks tabs */}
                        <Grid item sm={12}>
                            <Tabs value={tab} variant="fullWidth" centered selectionFollowsFocus onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab sx={{ fontSize: 18 }} icon={<Inbox />} iconPosition="start" label="Received Feedbacks"/>
                                <Tab sx={{ fontSize: 18 }} icon={<Outbox />} iconPosition="start" label="Sent Feedbacks"/>
                            </Tabs>
                            <TabPanel value={tab} index={0}>
                                <Grid container spacing={2}>
                                    {receivedFeedbacks.length > 0 ? receivedFeedbacks
                                        .slice((pageReceivedFeedbacks - 1) * feedbacksPerPage, pageReceivedFeedbacks * feedbacksPerPage)
                                        .map((feedback, index) => (
                                        <Grid item xs={"auto"} sm={6} md={4} key={index}>
                                            {feedback.liked === 1 ? <Typography>New</Typography> : <Typography> &nbsp; </Typography>}
                                            <Card sx={{
                                                border: 3,
                                                borderColor: (feedback.type === 'good') ? '#2196f3' : (feedback.type === 'improve') ? 'yellow' : 'black',
                                                position: 'relative',
                                            }} >
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div">
                                                            From: <Typography sx={{textDecoration: 'underline', fontSize: 18}} display="inline" color="text.primary">{feedback.reporter}</Typography>
                                                            {feedback.liked === 1 ?
                                                                <ThumbUp sx={{
                                                                    position: 'absolute',
                                                                    left: '300px',
                                                                    color: 'green'
                                                                }}/>
                                                                : null}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 15 }} variant="subtitle2" color="text.secondary" gutterBottom>
                                                            On {feedback.date}
                                                        </Typography>
                                                        <Typography noWrap sx={{ fontSize: 28 }} component="div">
                                                            {feedback.message}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    )) : <div> You have no received feedbacks </div>}
                                </Grid>
                                <Box py={1} display="flex" justifyContent="center">
                                    <Pagination
                                        onChange={(e, value) => {
                                            setPageReceivedFeedbacks(value)
                                        }}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                        page={pageReceivedFeedbacks}
                                        color="primary"
                                        count={numberOfPagesReceivedFeedbacks}/>
                                </Box>
                            </TabPanel>
                            <TabPanel value={tab} index={1}>
                                <Grid container spacing={4}>
                                    {sentFeedbacks.length > 0 ? sentFeedbacks
                                        .slice((pageSentFeedbacks - 1) * feedbacksPerPage, pageSentFeedbacks * feedbacksPerPage)
                                        .map((feedback, index) => (
                                            <Grid item xs={"auto"} sm={6} md={4} key={index}>
                                                <Card sx={{
                                                    minWidth: 275,
                                                    border: 3,
                                                    borderColor: (feedback.type === 'good') ? '#2196f3' : (feedback.type === 'improve') ? 'yellow' : 'black',
                                                    position: 'relative'
                                                }} >
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 17 }} color="text.secondary" component="div">
                                                            To: <Typography sx={{textDecoration: 'underline', fontSize: 18}} display="inline" color="text.primary">{feedback.to}</Typography>
                                                            {feedback.liked === 1 ?
                                                                <ThumbUp sx={{
                                                                    position: 'absolute',
                                                                    left: '300px',
                                                                    color: 'green'
                                                                }}/>
                                                                : null}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 15 }} variant="subtitle2" color="text.secondary" gutterBottom>
                                                            On {feedback.date}
                                                        </Typography>
                                                        <Typography noWrap sx={{ fontSize: 30 }} component="div">
                                                            {feedback.message}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )) : <div> You have no sent feedbacks </div>}
                                </Grid>
                                <Box py={1} display="flex" justifyContent="center">
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
                <Dialog open={open} onClose={handleClose}  fullWidth maxWidth={"md"}>
                    <form
                        onSubmit={handleSubmit}
                        id="myform"
                    >
                        <DialogTitle>Give Feedback</DialogTitle>
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
                            <Button variant={"contained"} onClick={handleClose}>Cancel</Button>
                            <Button type="submit" variant={"contained"} form="myform">Send</Button>
                        </DialogActions>
                    </form>
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