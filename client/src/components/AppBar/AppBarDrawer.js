import React, {useEffect} from 'react';
import {
    Button,
    Divider,
    IconButton,
    List,
    ListItem, ListItemButton, ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import {styled } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FeedbackIcon from '@mui/icons-material/FeedbackTwoTone';
import FlagIcon from '@mui/icons-material/FlagTwoTone';
import DashboardIcon from '@mui/icons-material/DashboardTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useNavigate} from "react-router-dom";
import {getUserInfo} from "../../api/userApi";

const drawerWidth = 200;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function AppBarDrawer({token, deleteToken, currentPage}) {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState('');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        deleteToken();
    }

    const handleFeedback = () => {
        navigate("/feedbacks");
    }

    const handleObjective = () => {
        navigate("/objectives");
    }

    const handleDashboard = () => {
        navigate("/dashboard");
    }

    useEffect(() => {
        getUserInfo(
            (response) => {
                setUser(response.data);
            },
            token,
            (error) => {
                if (error.response.data.error === 'Authentification failed. Check secret token.') {
                    deleteToken();
                    navigate("/");
                }
            })
    }, []);

    return(
        <div>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {currentPage}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ fontFamily: 'sans-serif',  fontWeight: 700, marginLeft: "auto"}}>
                        COMMUNITY CATALYST
                    </Typography>
                    <Button
                        variant="text"
                        color="inherit"
                        sx={{
                            marginRight: 5,
                            justifyContent: "flex-end",
                            marginLeft: "auto"
                        }}
                        endIcon={<AccountCircleIcon/>}
                        onClick={handleLogout}>
                        Log Out as {user.displayName}
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open} sx={{backgroundColor: 'red'}}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        { open===true ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key={'Dashboard'} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={handleDashboard}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <DashboardIcon color={'primary'}/>
                            </ListItemIcon>
                            <ListItemText primary={"Dashboard"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Feedback'} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={handleFeedback}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <FeedbackIcon color={'primary'}/>
                            </ListItemIcon>
                            <ListItemText primary={"Feedbacks"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Objectives'} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={handleObjective}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <FlagIcon color={'primary'}/>
                            </ListItemIcon>
                            <ListItemText primary={"Objectives"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}