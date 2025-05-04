import { Box, Typography } from "@mui/material"

interface SloganBoxProps {
    slogan: string;
    comment: string;
    bgcolor: string;
}

export default function SloganBox({ slogan, comment, bgcolor }: SloganBoxProps) {
    return (
        <Box sx={{ backgroundColor: bgcolor, borderRadius: 4, paddingY: 2, paddingX: 2, textAlign: 'left' }}>
            <Typography variant="h5" color="initial"
             sx={{fontWeight: '700'}} gutterBottom>
                    {slogan}
            </Typography>
            <Typography variant="body1" color="initial" gutterBottom>{comment}</Typography>
            
        </Box>
    );
}