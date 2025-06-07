import {
    AppBar, IconButton, Toolbar, Stack, Typography,
    BottomNavigation,
    BottomNavigationAction,
    Paper
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useState } from 'react';
import { useTheme, Theme } from '@mui/material/styles'

export default function BusinessWebBar() {
    const [value, setValue] = useState(0);
        const theme = useTheme<Theme>();
    return (
        <Paper sx={{ 
            position: 'fixed', 
            bottom: 0, left: 1, right: 1,
             display: {xs: 'block', sm: 'none'},
             borderTopLeftRadius: 25,
             borderTopRightRadius: 25
           }} 
           square={false}
             elevation={5}>
            <BottomNavigation
                showLabels
            
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                
                sx={{borderTopLeftRadius: 25, borderTopRightRadius: 25}}
            >
                <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} sx={{color: theme.palette.secondary.contrastText}} />
                <BottomNavigationAction  label="Scan QR" icon={<QrCodeScannerOutlinedIcon />} sx={{color: theme.palette.secondary.contrastText}}/>
                <BottomNavigationAction label="Profile" icon={<PersonOutlineOutlinedIcon />}sx={{color: theme.palette.secondary.contrastText}} />
            </BottomNavigation>
        </Paper>
    )

}