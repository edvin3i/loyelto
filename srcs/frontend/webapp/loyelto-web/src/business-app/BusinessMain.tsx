import { Box, CssBaseline, Typography, Stack, Chip, IconButton, Paper, Button, Card, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles'
import { useTheme, Theme } from '@mui/material/styles'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ProgramElement from './ProgramElement';
import CustomersOrOffersHeading from './CustomersOrOffersHeading';
import AddIcon from '@mui/icons-material/Add';

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
                        fontSize: { xs: '3rem' },
                        fontWeight: 800
                    }}>566 979</Typography>
                    <Box sx={{ paddingTop: 1 }}>
                        <Image src="coin_loyl.png"
                            sx={{ height: '2.8rem', width: '2.8rem' }}
                        />
                    </Box>
                </Stack>
                <Typography variant='caption' gutterBottom
                    sx={{
                        textAlign: 'center',
                        color: 'text.secondary'
                    }}>points you've distributed to the consumers</Typography>

            </Box>
            <Box component="section" sx={{
                marginTop: 2,
                marginX: 2,
                display: "flex",
                justifyContent: 'space-between'
            }}>
                <CustomersOrOffersHeading heading='New customers' chipContent={386} />
                <IconButton size="small">
                    <InfoOutlineIcon />
                </IconButton>
            </Box>
            <Box component="section" sx={{ marginX: 2 }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="h5" color="initial" gutterBottom
                        sx={{ fontWeight: '600' }}
                    >My loyalty program</Typography>
                    <IconButton size="small">
                        <InfoOutlineIcon />
                    </IconButton>
                </Box>
                <Stack spacing={2}>
                    <ProgramElement condition='each €10 spent =' points='5' />
                    <ProgramElement condition='more than €200 spent =' points='200' />
                </Stack>
            </Box>
            <Box component="section"
                sx={{
                    marginTop: 4,
                    marginX: 2,
                }}>
                <Box sx={{

                    display: "flex",
                    justifyContent: 'space-between',
                    marginBottom: 1.5
                }}>
                    <CustomersOrOffersHeading heading='My active offers' chipContent={5} />
                    <Button variant="contained" color="secondary" endIcon={<AddIcon fontSize='large' />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '1rem',
                            paddingY: 0,
                            borderRadius: 2
                        }}>Add</Button>
                </Box>
                <Card variant='outlined' sx={{padding: 1, borderRadius: 2}}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <Stack direction="column">
                            <Typography variant="h5" color="initial" gutterBottom
                                sx={{ fontWeight: '600' }}
                            >Free Pizza Margarita</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Classic pizza with tomato sauce, mozzarella, and fresh basil</Typography>
                        </Stack>
                        <Stack direction="column">
                            <CardMedia
                                component="img"
                                sx={{ width: 50 }}
                                image="pizza-nobg.png"
                                alt="Pizza Mozzarella campaign"
                            />
                            <Stack direction="column" sx={{ paddingRight: 2 }}>
                                <Box sx={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', justifyContent: 'center', color: 'blue' }}>15</Box>
                                <Box>points</Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Card>
            </Box>
        </>
    )
}