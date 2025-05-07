// import { Component } from 'react';
import { Toolbar, Typography, Grid, Box, CssBaseline } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme, Theme } from '@mui/material/styles'
import LoyelToBar from './LoyelToBar';
import MainSection from './MainSection';
import SlogansSection from './SlogansSection';
import { businessSlogans, consumerSlogans } from "./slogans";
import WaitlistForm from './WaitlistForm';
import SocialLinks from './SocialLinks';



export default function LandingPage() {
    const theme = useTheme<Theme>();
     // padding: {sm: '20'}, 
                // width: '98vw', 
                // marginTop: 70, 
                // marginBottom: 40 }}>

    return (
        <div>
            <CssBaseline />
            <LoyelToBar />
            <Toolbar />
            <Box
            sx={{
                padding: {sm: 5},
                marginTop: 5,
                marginBottom: 7
              
            }}> 
                <MainSection />
                <SlogansSection forWhom='Pour les BUSINESSES' bgcolor={theme.palette.secondary.light} slogans={businessSlogans} />
                <SlogansSection forWhom='Pour les CLIENTS' bgcolor={theme.palette.neutral.main} slogans={consumerSlogans} />
                
                {/* Add Waitlist Form */}
                <WaitlistForm />
                
                {/* Add Social Links */}
                <SocialLinks />
                
                {/* <Typography variant='h1' sx={{ color: theme.palette.secondary.dark, fontSize: '4rem', textAlign: 'center', mb: 4}}>WELCOME TO LOYELTO
            </Typography>
            <Stack direction="row" spacing={2} justifyContent='center'>
                <Button variant="contained" style={{ backgroundColor: theme.palette.primary.main}}>Sign in</Button>
                <Button variant="contained" >Join LoyelTo!</Button>
            </Stack> */}
            </Box>
        </div >
    )
}

// class LandingPage extends Component {
//     public render() {
//         return (
//             <div>
//                 <h1>WELCOME TO LOYELTO</h1>
//                 <Stack direction="row" spacing={2} >
//                     <Button variant="contained" >Sign in</Button>
//                     <Button variant="contained" >Join LoyelTo!</Button>
//                 </Stack>
//             </div >
//         )
//     }
// }

// export default LandingPage;