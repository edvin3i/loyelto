import { Paper, Box, Stack, Typography } from "@mui/material"
import { useTheme, Theme } from '@mui/material/styles'

interface ProgramElementProps {
    condition: string;
    points: string;
}

export default function ProgramElement({ condition, points }: ProgramElementProps) {
    const theme = useTheme<Theme>();
    return (
        <Paper elevation={0}
            sx={{ backgroundColor: theme.palette.info.light, paddingY: 0.5, borderRadius: 2 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ paddingLeft: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{fontSize: '1rem', fontWeight: 600}}>{condition}</Typography></Box>
                <Stack direction="column" sx={{ paddingRight: 2 }}>
                    <Box sx={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 'normal', display: 'flex', justifyContent: 'center' }}>
                        {points}
                    </Box>
                    <Box sx={{textAlign:"center", lineHeight: 'normal'}}>points</Box>
                </Stack>
            </Box>
        </Paper>
    );
}