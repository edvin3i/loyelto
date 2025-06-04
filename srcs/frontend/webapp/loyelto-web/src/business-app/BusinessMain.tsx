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
            <Stack id="upperSectionBusinessMain" direction={{ xs: 'column', sm: 'row' }}>
                <Box component="header" sx={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 2,
                    paddingX: 6
                }}>
                    <Typography variant='h4' color='initial' sx={{
                        fontWeight: 500,
                        fontSize: '1.5rem'
                    }} gutterBottom>My balance</Typography>
                    <Stack direction="row" spacing={1}>
                        <Typography variant='h1' sx={{
                            fontSize: { xs: '3rem' },
                            fontWeight: 800,
                            letterSpacing: '0.1rem'
                        }}>566 979</Typography>
                        <Box sx={{ paddingTop: 1 }}>
                            <Image src="coin_loyl.png"
                                sx={{ height: '2.8rem', width: '2.8rem' }}
                            />
                        </Box>
                    </Stack>
                    <Typography variant="body2" gutterBottom
                        sx={{
                            textAlign: 'center',
                            color: 'text.secondary'
                        }}>points you've distributed to the consumers</Typography>

                </Box>
                <Box component="section" sx={{
                    margin: 2,
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
                            sx={{ fontWeight: '600', fontSize: '1.3rem' }}
                        >My loyalty program</Typography>
                        <IconButton size="small">
                            <InfoOutlineIcon />
                        </IconButton>
                    </Box>
                    <Stack spacing={1}>
                        <ProgramElement condition='each €10 spent =' points='5' />
                        <ProgramElement condition='more than €200 spent =' points='200' />
                    </Stack>
                </Box>
            </Stack>
            <Box component="section"
                sx={{
                    marginTop: 4,
                    marginX: 2,
                    backgroundColor: theme.palette.neutral.light,
                    boxSizing: 'border-box',
                    padding: 2,
                    borderRadius: 3
                }}>
                <Box sx={{

                    display: "flex",
                    justifyContent: 'space-between',
                    marginBottom: 1.5
                }}>
                    <CustomersOrOffersHeading heading='My active offers' chipContent={5} />
                    <Button variant="contained" color="info" endIcon={<AddIcon fontSize='large' />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '1rem',
                            paddingY: 0,
                            borderRadius: 2
                        }}>Add</Button>
                </Box>
                <Stack id="cardStackBusinessMain" direction={{ xs: 'column', sm: 'row' }} sx={{ flexWrap: { sm: 'wrap' } }}>
                    <Card variant='outlined' sx={{ padding: 1, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Stack direction="column" sx={{ paddingRight: 3 }}>
                                <Typography variant="h5" color="initial" gutterBottom
                                    sx={{ fontWeight: '600', fontSize: '1.3rem' }}
                                >Free Pizza Margarita</Typography>
                                <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
                                    Classic pizza with tomato sauce, mozzarella, and fresh basil</Typography>
                                <Typography variant='h6' gutterBottom sx={{ fontSize: '1rem', fontWeight: 700 }}>
                                    <span style={{ color: 'green' }}>150</span>/300 left
                                </Typography>
                                <Button fullWidth variant='contained' color='error'
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        borderRadius: 2
                                    }}>Stop promo</Button>
                            </Stack>
                            <Stack direction="column" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ backgroundColor: theme.palette.info.light, borderRadius: 1 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 75 }}
                                        image="pizza-nobg.png"
                                        alt="Pizza Margarita campaign"
                                    />
                                </Box>
                                <Stack direction="column" >
                                    <Box sx={{ fontSize: '1.7rem', fontWeight: 700, display: 'flex', justifyContent: 'center', color: theme.palette.info.dark }}>15</Box>
                                    <Box>points</Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Card>
                    <Card variant='outlined' sx={{ padding: 1, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Stack direction="column" sx={{ paddingRight: 3 }}>
                                <Typography variant="h5" color="initial" gutterBottom
                                    sx={{ fontWeight: '600', fontSize: '1.3rem' }}
                                >Free Pizza Margarita</Typography>
                                <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
                                    Classic pizza with tomato sauce, mozzarella, and fresh basil</Typography>
                                <Typography variant='h6' gutterBottom sx={{ fontSize: '1rem', fontWeight: 700 }}>
                                    <span style={{ color: 'green' }}>150</span>/300 left
                                </Typography>
                                <Button fullWidth variant='contained' color='error'
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        borderRadius: 2
                                    }}>Stop promo</Button>
                            </Stack>
                            <Stack direction="column" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ backgroundColor: theme.palette.info.light, borderRadius: 1 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 75 }}
                                        image="pizza-nobg.png"
                                        alt="Pizza Margarita campaign"
                                    />
                                </Box>
                                <Stack direction="column" >
                                    <Box sx={{ fontSize: '1.7rem', fontWeight: 700, display: 'flex', justifyContent: 'center', color: theme.palette.info.dark }}>15</Box>
                                    <Box>points</Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Card>
                    <Card variant='outlined' sx={{ padding: 1, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Stack direction="column" sx={{ paddingRight: 3 }}>
                                <Typography variant="h5" color="initial" gutterBottom
                                    sx={{ fontWeight: '600', fontSize: '1.3rem' }}
                                >Free Pizza Margarita</Typography>
                                <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
                                    Classic pizza with tomato sauce, mozzarella, and fresh basil</Typography>
                                <Typography variant='h6' gutterBottom sx={{ fontSize: '1rem', fontWeight: 700 }}>
                                    <span style={{ color: 'green' }}>150</span>/300 left
                                </Typography>
                                <Button fullWidth variant='contained' color='error'
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        borderRadius: 2
                                    }}>Stop promo</Button>
                            </Stack>
                            <Stack direction="column" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ backgroundColor: theme.palette.info.light, borderRadius: 1 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 75 }}
                                        image="pizza-nobg.png"
                                        alt="Pizza Margarita campaign"
                                    />
                                </Box>
                                <Stack direction="column" >
                                    <Box sx={{ fontSize: '1.7rem', fontWeight: 700, display: 'flex', justifyContent: 'center', color: theme.palette.info.dark }}>15</Box>
                                    <Box>points</Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Card>
                </Stack>
            </Box>
        </>
    )
}