import { Box, Typography } from "@mui/material"

interface SloganBoxProps {
    slogan: string;
    comment: string;
    bgcolor: string;
}

export default function SloganBox({ slogan, comment, bgcolor }: SloganBoxProps) {
    return (
        <Box 
          sx={{ 
            bgcolor: bgcolor,
            padding: 2,
            borderRadius: 2,
            minHeight: 130,
            width: '100%',    // Full width within its container
            display: 'flex',
            justifyContent: 'center',  
            flexDirection: 'column'
          }}
        >
            <Typography variant="h5" color="initial"
             sx={{fontWeight: '700'}} gutterBottom>
                    {slogan}
            </Typography>
            <Typography variant="body1" color="initial" gutterBottom>{comment}</Typography>
            
        </Box>
    );
}