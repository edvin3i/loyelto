import { Stack, Box, Typography, Button } from "@mui/material"
import { styled } from '@mui/material/styles'
import { useTheme, Theme } from '@mui/material/styles'

const Image = styled('img')({
    width: '100%',
});

export default function MainSection() {
    const theme = useTheme<Theme>();
    return (

        <Stack direction={{ xs: 'column', sm: 'row' }}>
            <Box sx={{
                // backgroundColor: theme.palette.secondary.dark,
                width: {sm: '50%', xs: '100%'},
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "center",
                padding: 2
            }}>
                <Typography
                    variant="h1"
                    color="initial"
                    sx={{
                        fontSize: {xs: '2.5rem', sm: '5.1rem'},
                        fontWeight: '600',
                        textAlign: 'left'
                    }}  
                >
                    Swap & Save: <br /> La Fidélité Nouvelle Génération
                </Typography>
                <Button fullWidth size="large" variant="contained"
                    sx={{
                        alignSelf: 'center',
                        marginTop: 3,
                        fontWeight: 'bold',
                        paddingY: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '1.5rem'
                    }}
                >
                    Join LoyelTo
                </Button>
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: {sm: '50%', xs: '100%'},
                // paddingX: 8,
                // paddingY: 2,
                backgroundColor: theme.palette.secondary.main,
                borderRadius: 7
            }}>
                <Image src='../public/ecran_julien_nobg.png' sx={{ width: '50%', margin: 5 }} />
            </Box>
        </Stack>
    )
}