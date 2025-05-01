// import { Component } from 'react';
import { Toolbar, Typography, Grid, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme, Theme } from '@mui/material/styles'
import LoyelToBar from './LoyelToBar';
import MainSection from './MainSection';


export default function LandingPage() {
    // const theme = useTheme<Theme>();

    return (
        <div>
            <LoyelToBar />
            <Toolbar />
            
            <MainSection />
            {/* <Typography variant='h1' sx={{ color: theme.palette.secondary.dark, fontSize: '4rem', textAlign: 'center', mb: 4}}>WELCOME TO LOYELTO
            </Typography>
            <Stack direction="row" spacing={2} justifyContent='center'>
                <Button variant="contained" style={{ backgroundColor: theme.palette.primary.main}}>Sign in</Button>
                <Button variant="contained" >Join LoyelTo!</Button>
            </Stack> */}
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