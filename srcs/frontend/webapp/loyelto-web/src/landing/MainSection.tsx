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

        <Stack component="section" direction="row" sx={{
            marginBottom: 5,
            
            marginX: 'auto',
            display: { xs: 'none', sm: 'flex' }
        }}>
            <Box sx={{
                // maxWidth: 524,
                width: "41%",
                height: 380,
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography
                    variant="h1"
                    color="initial"
                    gutterBottom
                    sx={{
                        fontSize: 56,
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
                            fontSize: '1.5rem',
                        }}>
                        {t('joinLoyeltoButton')}
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    // maxWidth: 740,
                    width: "59%",
                    height: 380,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 7
                }}>
                <Stack direction="row" sx={{ height: '100%' }}>
                    <Box sx={{width: "50%", paddingLeft: 6, paddingTop: 12}}>
                        <Image src='landing_swapping_cutout.png'
                            sx={{
                                // width: 200,
                                // marginTop: { xs: 4, sm: 10 },
                            }} />
                    </Box>
                    <Box sx={{ overflow: 'hidden', width: '50%', paddingX: 7}}>
                        <Image src='phone_loyl_coin.jpg'
                            sx={{
                                borderRadius: 10,
                              
                                // width: "50%",
                                marginTop: 10,
                                objectFit: 'cover', // Ensures the image is cropped to fit the parent
                            }} />
                    </Box>
                </Stack>

            </Box>
        </Stack>
    )
}