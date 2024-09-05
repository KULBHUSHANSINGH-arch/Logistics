import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useLocation } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import Gard from './Components/SecurityGaurd/Gard';

/**** Images  */
import logo from "./Assets/Images/logo.png";

/***********     Icons */
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

import { Link } from 'react-router-dom';




const drawerWidth = 240;

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

export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const [designation, setDesignation] = useState('');

    const [openNestedList, setOpenNestedList] = useState({});
    const [profileImg, setProfileImg] = useState('');
    const [name, setName] = useState('');
    const [showCard, setShowCard] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userProfile = localStorage.getItem("profilePic");
        const userName = localStorage.getItem("userName");
        const Designation = localStorage.getItem("Designation");
        if (userProfile) {
            setProfileImg(userProfile);
        }
        if (userName) {
            setName(userName);
        }
        if (Designation) {
            setDesignation(Designation);
        }
    }, []);

    const handleMenuItemClick = (path) => {
        navigate(path);
    };

    const handleExpandClick = (menuText) => {
        setOpenNestedList((prev) => ({
            ...prev,
            [menuText]: !prev[menuText],
        }));
    };


    const selectedStyle = {
        backgroundColor: '#e0e0e0',
        // color: '#1976d2',
    };


    const handleLogout = () => {
        localStorage.removeItem("profilePic");
        localStorage.removeItem("userName");
        localStorage.removeItem('Token');
        navigate("/");
        window.location.reload();
    };

    const toggleCard = () => {
        setShowCard(!showCard);
    };


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    /** Sidbar Icons & Text Data */

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <AccountBalanceIcon />,
            path: '/dashboard',
        },
        {
            text: 'Security Guard ',
            icon: <LocalPoliceIcon />,
            children: [
                { text: 'Guard', icon: <PrivacyTipIcon />, path: '/gard' },
                // { text: 'PO List', icon: <POListIcon />, path: '/polist' },
            ],
        },
    ];

    const getVisibleMenuItems = (designation) => {
        switch (designation) {
            case 'Super Admin':
                return menuItems;
            case 'Maintenance Head':
                return menuItems.filter(item =>
                    item.text === 'Dashboard' || item.text === 'Spare Part In' || item.text === 'Machine Maintenance'
                );
            case 'Spare Part Store Manager':
                return menuItems.filter(item => item.text === 'Dashboard' || item.text === 'Spare Part In');
            case 'Maintenance Engineer':
                return menuItems.filter(item => item.text === 'Dashboard' || item.text === 'Machine Maintenance');
            default:
                return [];
        }
    };

    console.log("Visible Menu Items:", getVisibleMenuItems(designation));
    const visibleMenuItems = getVisibleMenuItems(designation);
    console.log("Current designation userName:", designation);
    console.log("Visible Menu Items:", visibleMenuItems);

    return (
        <Box >
            <CssBaseline />
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

                    <Link to='/dashboard'>
                        <img src={logo} alt="Mini variant drawer" style={{ width: '20%', height: 'auto', background: "transparent" }} />
                    </Link>


                    <Box sx={{ flexGrow: 1 }} />
                    <div className="d-flex align-items-center">
                        {profileImg && (
                            <div style={{ position: 'relative' }}>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="profile-tooltip">Hi, {name}</Tooltip>}
                                >
                                    <Image
                                        src={profileImg}
                                        alt="profile"
                                        style={{
                                            height: '42px',
                                            width: '42px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            marginRight: '10px',
                                            border: '2px solid #ccc',
                                        }}
                                        onClick={toggleCard}
                                    />
                                </OverlayTrigger>
                                {showCard && (
                                    <div className="card" style={{ position: 'absolute', backgroundColor: '#E4E5E3', top: '50px', right: '10px', width: '150px', padding: '10px', borderRadius: '10px' }}>
                                        <Image
                                            src={profileImg}
                                            alt="profile"
                                            style={{
                                                height: '62px',
                                                width: '62px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid #ccc',
                                                margin: '10px auto',
                                                display: 'block',
                                            }}
                                        />
                                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>Hi, {name}</div>
                                        <button className="btn btn-outline-danger btn-sm" style={{ borderRadius: '5px', margin: '0 auto', display: 'block' }} onClick={handleLogout}>
                                            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {/* 1. Final Updated List in Drawer */}
                <List>
                    {visibleMenuItems.map((item, index) =>
                        item.children ? (
                            <React.Fragment key={index}>
                                <ListItemButton onClick={() => handleExpandClick(item.text)}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                                <Collapse in={openNestedList[item.text]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.children.map((child, childIndex) => (
                                            <ListItem key={childIndex} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    to={child.path}
                                                    sx={{
                                                        pl: 4, // indentation for child items
                                                        ...(location.pathname === child.path ? selectedStyle : {}),
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            ...(location.pathname === child.path ? { color: '#1976d2' } : {}),
                                                        }}
                                                    >
                                                        {child.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={child.text}
                                                        sx={{
                                                            ...(location.pathname === child.path ? { fontWeight: 'bold', color: '#1976d2' } : {}),
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        ) : (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        ...(location.pathname === item.path ? selectedStyle : {}),
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            ...(location.pathname === item.path ? { color: '#1976d2' } : {}),
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            ...(location.pathname === item.path ? { fontWeight: 'bold', color: '#1976d2' } : {}),
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    )}
                </List>

            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: open ? `${drawerWidth}px` : `calc(${theme.spacing(2)} + 1px)`,
                    transition: theme.transitions.create(['margin-left'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}>
                <DrawerHeader />
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/gard" element={<Gard />} />
                </Routes>
            </Box>

        </Box>

    );
}