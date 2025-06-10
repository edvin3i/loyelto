import {
    AppBar, IconButton, Toolbar, Stack, Typography,
    BottomNavigation,
    BottomNavigationAction,
    Paper
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useState, useEffect } from 'react';
import { useTheme, Theme } from '@mui/material/styles'
import { Link, useLocation } from 'react-router-dom';


export default function BusinessWebBar() {

    const theme = useTheme<Theme>();
    const location = useLocation();
    const [value, setValue ] = useState(0);
    useEffect(() => {
        switch(location.pathname) {
            case '/business-main':
                setValue(0);
                break;
            case '/client-page':
                setValue(1);
                break;
            case '/profile':
                setValue(2);
                break;
            default:
                setValue(0);
                break;
        }
    }, [location.pathname])
    return (
        <Paper sx={{
            position: 'fixed',
            bottom: 0, left: 1, right: 1,
            display: { xs: 'block', sm: 'none' },
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25
        }}
            square={false}
            elevation={7}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}

                sx={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
            >
                <BottomNavigationAction component={Link} to='/business-main' label="Home" icon={<HomeOutlinedIcon />} sx={{ color: theme.palette.secondary.contrastText, }} />
                <BottomNavigationAction component={Link} to='/client-page' label="Scan QR" icon={<QrCodeScannerOutlinedIcon />} sx={{ color: theme.palette.secondary.contrastText }} />
                <BottomNavigationAction label="Profile" icon={<PersonOutlineOutlinedIcon />} sx={{ color: theme.palette.secondary.contrastText }} />
            </BottomNavigation>
        </Paper>
    )

}