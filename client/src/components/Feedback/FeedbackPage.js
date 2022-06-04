import React, {useEffect} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card, CardActionArea,
    CardActions,
    CardContent, Checkbox,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControlLabel,
    FormGroup,
    Grid, Pagination,
    Paper, Radio, RadioGroup, Tab, Tabs,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import AppBarDrawer from "../AppBar/AppBarDrawer";
import { AddComment, Inbox, Outbox} from "@mui/icons-material";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

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
    const [feedbackType, setFeedbackType] = React.useState('good');
    const [tab, setTab] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [numberOfPages, setNumberOfPages] = React.useState(1);
    const [displayReceivedFeedbacks, setDisplayReceivedFeedbacks] = React.useState([]);
    const [receivedFeedbacks, setReceivedFeedbacks] = React.useState([]);

    const feedbacksPerPage = 12;

    const companyEmployees = [
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
        { label: 'The Lord of the Rings: The Fellowship of the Ring' }];

    const handleChange = (event, newValue) => {
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

    useEffect(() => {
        const hiddenPages = (page - 1) * feedbacksPerPage;
        setNumberOfPages(Math.ceil(receivedFeedbacks.length/feedbacksPerPage));
        setDisplayReceivedFeedbacks(receivedFeedbacks.slice(hiddenPages, hiddenPages + feedbacksPerPage));
    }, [receivedFeedbacks]);

    useEffect(() => {
        const hiddenPages = (page - 1) * feedbacksPerPage;
        setDisplayReceivedFeedbacks(receivedFeedbacks.slice(hiddenPages, hiddenPages + feedbacksPerPage));
    }, [page]);

    useEffect(() => {
        setReceivedFeedbacks([
            {
                reporter: "Alin",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Aldi",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Nico",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Alin2",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Aldi2",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Nico2",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Alin3",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Aldi3",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Nico3",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Alin23",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Aldi23",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Nico23",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Alin4",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Aldi4",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Nico4",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Alin24",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Aldi24",
                message: "You did it!",
                date: "o data"
            },
            {
                reporter: "Nico24",
                message: "You did it!",
                date: "o data"
            },
        ])
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
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: '#FFFFFF', }}>
                    <Grid container spacing={3}>
                        {/* Feedbacks button */}
                        <Grid item sm={12}>
                            <Button startIcon={<AddComment/>} variant={"contained"} onClick={handleClickOpen}> Give Feedback</Button>
                        </Grid>
                        {/* Feedbacks tabs */}
                        <Grid item sm={12}>
                            <Tabs value={tab} variant="fullWidth" centered onChange={handleChange} aria-label="basic tabs example">
                                <Tab icon={<Inbox />} iconPosition="start" label="Received Feedbacks"/>
                                <Tab icon={<Outbox />} iconPosition="start" label="Sent Feedbacks"/>
                            </Tabs>
                            <TabPanel value={tab} index={0}>
                                <Grid container spacing={4}>
                                    {displayReceivedFeedbacks.length > 0 ? displayReceivedFeedbacks.map(feedback => (
                                        <Grid item xs={"auto"} sm={6} md={4} key={feedback.reporter}>
                                            <Card sx={{ minWidth: 275 }}>
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                            From {feedback.reporter}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                            On {feedback.date}
                                                        </Typography>
                                                        <Typography variant="h5" component="div">
                                                            {feedback.message}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    )) : <div> You have no feedbacks </div>}
                                </Grid>
                                <Pagination
                                    onChange={(e, value) => setPage(value)}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                    variant="outlined"
                                    count={numberOfPages}/>
                            </TabPanel>
                            <TabPanel value={tab} index={1}>
                                Item Two
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Container>
                <Dialog open={open} onClose={handleClose}  fullWidth maxWidth={"md"}>
                    <DialogTitle>Give Feedback</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please write a constructive feedback
                        </DialogContentText>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox/>} label="Anonymous" />
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
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Send</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}