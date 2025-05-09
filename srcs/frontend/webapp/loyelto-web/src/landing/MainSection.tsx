import { Stack, Box, Typography, Button } from "@mui/material"
import { styled } from '@mui/material/styles'
import { useTheme, Theme } from '@mui/material/styles'
import { Outlet } from "react-router-dom";


const Image = styled('img')({
    width: '100%',

});

export default function MainSection() {
    const theme = useTheme<Theme>();
    return (
<>
        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} sx={{marginBottom: 5}}>
            <Box sx={{
                // backgroundColor: theme.palette.secondary.dark,
                width: { sm: '50%', xs: '100%' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "center",
                
                // padding: 2
            }}>
                <Typography
                    variant="h1"
                    color="initial"
                    gutterBottom
                    sx={{
                        fontSize: { xs: '2.5rem', sm: '5rem' },
                        fontWeight: '600',
                        textAlign: {xs:'center', sm:'left'},
                        marginTop: 2

                    }}
                >
                    Swap & Save: <br /> La Fidélité Nouvelle Génération
                </Typography>
                <Box sx={{ marginLeft: {sm: 0}, marginTop: 1, marginX: {xs: 2}}}>
                    <Button fullWidth size="large" variant="contained"
                        sx={{
                            alignSelf: 'center',
                            // margin: 3,
                            fontWeight: 'bold',
                            paddingY: {sm:1.5, xs: 1},
                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: {sm:'1.5rem', xs: '1.2rem'}, 
                           
                        }}
                        href="/form-business"
                    >
                        Join LoyelTo
                    </Button>
                </Box>
            </Box>
            <Box 
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { sm: '50%', xs: '100%' },
                    height: { xs: '96vw', sm: 'auto' },
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 7,
                    overflow: 'hidden' // Ensures the image is cropped if it overflows
                }}>
                <Image src='/ecran_julien_nobg.png'
                    sx={{
                        width: { xs: '85%', sm: '50%' },
                        marginTop: { xs: 4, sm: 7 },
                        marginBottom: { xs: 'auto', sm: 7 },

                        objectFit: 'cover', // Ensures the image is cropped to fit the parent
                    }} />
            </Box>
        </Stack>
        <Outlet/>
        </>
    )
}