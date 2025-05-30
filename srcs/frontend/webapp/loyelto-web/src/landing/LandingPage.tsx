// import { Component } from 'react';
import { Toolbar, Typography, Grid, Box, CssBaseline } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme, Theme } from '@mui/material/styles'
import LoyelToBar from './LoyelToBar';
import MainSection from './MainSection';
import SlogansSection from './SlogansSection';
import { businessSlogans_fr, businessSlogans_en, consumerSlogans_en, consumerSlogans_fr } from "./slogans";
import WaitlistForm from './WaitlistForm';
import SocialLinks from './SocialLinks';
import { useTranslation } from 'react-i18next'
import MainSectionMobile from './MainSectionMobile';



export default function LandingPage() {
    const theme = useTheme<Theme>();
    const { t, i18n } = useTranslation();
    const businessSlogans = i18n.language === 'en' ? businessSlogans_en : businessSlogans_fr;
    const consumerSlogans = i18n.language === 'en' ? consumerSlogans_en : consumerSlogans_fr;

    return (
        <div>
            <CssBaseline />


            <LoyelToBar />
            <Toolbar />
            <Box component="main"
                sx={{
                    padding: { sm: 5 },
                    marginTop: 5,
                    marginBottom: 7,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: { sm: 1200, xs: 340 }
                    // width: '100%',
                    maxWidth: {sm: 1200, xs: 340}
                }}>
                <MainSection />
                <MainSectionMobile />
                <SlogansSection forWhom={t('businessSloganTitle')} bgcolor={theme.palette.secondary.light} slogans={businessSlogans} />
                <SlogansSection forWhom={t('consumerSloganTitle')} bgcolor={theme.palette.neutral.main} slogans={consumerSlogans} />
                <WaitlistForm />
                <SocialLinks />
            </Box>


        </div >
    )
}
