import { Stack, Box, Typography, Button } from "@mui/material"
import { styled } from '@mui/material/styles'
import { useTheme, Theme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const Image = styled('img')({
    width: '100%',

});

export default function MainSectionMobile() {
    const theme = useTheme<Theme>();
    const { t } = useTranslation();
    return (
        <Stack component="section" sx={{
            display: { sm: 'none', xs: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            height: 800
        }}>
            <Box sx={{
                backgroundColor: theme.palette.secondary.main,
      
                borderRadius: 5,
                height: 460,
                width: 335,
                paddingX: 2
            }}>
                <Stack >
                    <Image src='landing_swapping_cutout.png' sx={{
                        borderRadius: 3}} />
                    <Typography variant="h1" color="initial" sx={{
                        fontSize: 43,
                        fontWeight: 600,
                        textAlign: 'center',
                    }}>
                        Swap & Save: <br /> {t('mainHeading')}
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            document.getElementById('join-waitlist')?.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }}
                        sx={{
                            alignSelf: 'center',
                            fontWeight: 'bold',

                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            margin: 3,
                            boxShadow: 'none'
                        }}>
                        {t('joinLoyeltoButton')}
                    </Button>
                </Stack>
            </Box>
            <Box sx={{
                overflow: 'hidden',
                width: 335,
                height: 335,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                backgroundColor: theme.palette.secondary.light,
                borderRadius: 5
            }}>
                <Image src='phone_loyl_coin.jpg'
                    sx={{
                        width: { xs: '85%', sm: '95%' },
                        marginTop: 3,
                        borderRadius: 12,
                        objectFit: 'cover', // Ensures the image is cropped to fit the parent
                    }} />
            </Box>
        </Stack>
    )
}