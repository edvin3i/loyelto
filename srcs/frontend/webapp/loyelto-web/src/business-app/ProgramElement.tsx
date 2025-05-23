import { Paper, Box, Stack } from "@mui/material"

interface ProgramElementProps {
    condition: string;
    points: string;
}

export default function ProgramElement({ condition, points }: ProgramElementProps) {
    return (
        <Paper sx={{ backgroundColor: 'grey' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ paddingLeft: 2, display: 'flex', alignItems: 'center' }}>{condition}</Box>
                <Stack direction="column" sx={{ paddingRight: 2 }}>
                    <Box sx={{ fontSize: '1.7rem', fontWeight: 700, display: 'flex', justifyContent: 'center' }}>{points}</Box>
                    <Box>points</Box>
                </Stack>
            </Box>
        </Paper>
    );
}