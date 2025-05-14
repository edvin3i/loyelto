import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Stack, SvgIcon, Box, useScrollTrigger, Button } from '@mui/material';
import { styled } from '@mui/material/styles'

import svgLogo from '../assets/loyelto_cropped.svg'
import { useTheme, Theme } from '@mui/material/styles'

import { useTranslation } from 'react-i18next';

interface Props {
    children?: React.ReactElement<{ elevation?: number }>;
}

function ElevationScroll(props: Props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });
    return children ? React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    })
        : null;
}

export default function LoyelToBar(props: Props) {
    const theme = useTheme<Theme>();
    const Image = styled('img')({
        width: '100%',
    });
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'fr' : 'en';
        i18n.changeLanguage(newLang);
    }

    return (
        <ElevationScroll {...props}>
            <AppBar position='fixed' sx={{ zIndex: 10, backgroundColor: theme.palette.primary.light }}>
                <Toolbar>
                    <Stack direction="row" spacing={4} 
                    sx={{ 
                        marginLeft: {sm:5, xs: 1}, 
                        marginTop: 2,
                        flexGrow: 1
                        }}>
                        <div style={{ paddingLeft: '1rem' }}>
                            <Image src={svgLogo} alt='logo' sx={{ 
                                height: {xs: '4rem', sm: '6.5rem'}, 
                                width: { xs: '4rem', sm:'6.5rem'} 
                                }} />
                        </div>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Typography variant="h3" color="initial"  sx={{
                                fontSize: {xs: '2rem', sm: '3rem'}, 
                                fontFamily: "Nunito", 
                                fontWeight: "bold", 
                                letterSpacing: '0.15rem' 
                                }}>LOYELTO</Typography>
                            <Typography variant="subtitle1" color="initial" sx={{ fontFamily: "Inter" }}>Loyalty Exchange</Typography>
                        </Box>

                    </Stack>
                    <Button color="inherit" size="large" onClick={toggleLanguage}
                    sx={{
                        padding: 0,
                        fontSize: '2rem',
                        marginRight: 2
                    }}>{ i18n.language === 'en' ? '🇫🇷' : '🇬🇧'}</Button>
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    )
}