import { Box, CssBaseline, Typography, Stack, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles'
import { useTheme, Theme } from '@mui/material/styles'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

const Image = styled('img')({
    width: '100%',

});

export default function BusinessMain() {
    const theme = useTheme<Theme>();
    return (
        <>
            <CssBaseline />
            <Box component="header" sx={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 2,
                paddingX: 5
            }}>
                <Typography variant='h4' gutterBottom>My balance</Typography>
                <Stack direction="row" spacing={1}>
                    <Typography variant='h1' sx={{
                        fontSize: { xs: '3.5rem' },
                        fontWeight: 800
                    }}>566 979</Typography>
                    <Box sx={{ paddingTop: 1 }}>
                        <Image src="coin_loyl.png"
                            sx={{ height: '3.5rem', width: '3.5rem' }}
                        />
                    </Box>
                </Stack>
                <Typography variant='caption' gutterBottom
                    sx={{
                        textAlign: 'center'
                    }}>points that you've distributed to the consumers</Typography>

            </Box>
            <Box component="section" sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: 'space-around'
            }}>
                <Stack direction="row">
                    <Typography variant='h6' color='initial' gutterBottom sx={{ fontWeight: 600 }}>New customers:</Typography>
                    <Chip label="657" size="small" sx={{
                        backgroundColor: theme.palette.secondary.main,
                        // fontSize: '1.1rem',
                        fontWeight: 600,
                        marginTop: 0.5,
                        marginLeft: 1
                    }} />
                </Stack>
                <IconButton size="small">
                    <InfoOutlineIcon />
                </IconButton>
            </Box>
            <Box component="section">
                <Box sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: 'space-around'
                }}>
                    <Typography variant="h5" color="initial"
                        sx={{ fontWeight: 'bold' }}
                    >My loyalty program</Typography>
                    <IconButton size="small">
                        <InfoOutlineIcon />
                    </IconButton>
                </Box>
                <Stack></Stack>
            </Box>
        </>
    )
}