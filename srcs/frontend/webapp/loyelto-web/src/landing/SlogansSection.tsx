import { Stack, Typography, Box } from "@mui/material"
import SloganBox from "./SloganBox"
import theme from "../theme";
import { useTheme, Theme } from '@mui/material/styles'
import SlogansStack from "./SlogansStack";

interface SlogansProps{
    forWhom: string;
    bgcolor: string;
    slogans: { slogan: string; comment: string }[];   
}



export default function SlogansSection({ forWhom, bgcolor, slogans }: SlogansProps) {
    // const theme = useTheme<Theme>();
    return (
        <div>
            <Typography variant="h3" 
            color="initial" 
            sx={{
                textAlign: 'left',
                paddingY: 3,
                fontWeight: '600',
                fontSize: {xs: '2rem', sm: '2.6rem'}
                
                }}>
                {forWhom}
            </Typography>
            <SlogansStack bgcolor={bgcolor} slogans={slogans}></SlogansStack>
            
        </div>

    )
}