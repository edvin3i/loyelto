import { Stack, Box, Typography, Button } from "@mui/material"
import { styled } from '@mui/material/styles'
import { useTheme, Theme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'


const Image = styled('img')({
    width: '100%',

});

export default function MainSection() {
    const theme = useTheme<Theme>();
    const { t } = useTranslation();
    return (

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ marginBottom: 5 }}>
            <Box sx={{
                width: { sm: '50%', xs: '100%' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "center",
            }}>
                <Typography
                    variant="h1"
                    color="initial"
                    gutterBottom
                    sx={{
                        fontSize: { xs: '2.5rem', sm: '4.1rem', xl: '5.5rem' },
                        fontWeight: '600',
                        textAlign: { xs: 'center', sm: 'left' },
                        marginBottom: { xs: 2, sm: 4 },
                        marginTop: 2
                    }}>
                    Swap & Save: <br /> {t('mainHeading')}
                </Typography>
                <Box sx={{ marginLeft: { sm: 0 }, marginTop: 1, marginX: { xs: 2 } }}>
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={() => {
                            document.getElementById('join-waitlist')?.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }}
                        sx={{
                            alignSelf: 'center',
                            fontWeight: 'bold',
                            paddingY: { sm: 1.5, xs: 1 },
                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: { sm: '1.5rem', xs: '1.2rem' },
                        }}>
                        {t('joinLoyeltoButton')}
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{  
                    width: { sm: '50%', xs: '100%' },
                    height: { xs: '96vw', sm: '60vh' },
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 7
                }}>
                <Stack direction="row" sx={{height: '100%'}}>
                    <Box>
                        <Image src='landing_swapping_cutout.png'
                            sx={{
                                width: { xs: '85%' },
                                marginTop: { xs: 4, sm: 10 },
                            }} />
                    </Box>
                    <Box sx={{ overflow: 'hidden'}}>
                        <Image src='ecran_julien_nobg.png'
                            sx={{
                                width: { xs: '85%', sm: '95%' },
                                marginTop: { xs: 4, sm: 9 },
                                objectFit: 'cover', // Ensures the image is cropped to fit the parent
                            }} />
                    </Box>
                </Stack>

            </Box>
        </Stack>
    )
}