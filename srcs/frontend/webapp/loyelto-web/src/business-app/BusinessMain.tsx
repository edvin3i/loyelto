import { Box, CssBaseline, Typography, Stack, Chip, IconButton, Paper, Button, Card, CardMedia, Grid } from '@mui/material';
import { styled } from '@mui/material/styles'
import { useTheme, Theme } from '@mui/material/styles'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ProgramElement from './ProgramElement';
import CustomersOrOffersHeading from './CustomersOrOffersHeading';
import AddIcon from '@mui/icons-material/Add';
import PromoCard from './PromoCard';
import BusinessWebBar from './BusinessWebBar';

const Image = styled('img')({
    width: '100%',

});

export default function BusinessMain() {
    const theme = useTheme<Theme>();
    return (
        <>
            <CssBaseline />
            <Box sx={{backgroundColor: { sm: theme.palette.info.light },  display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{  boxSizing: 'border-box', width: { xs: '100vw', sm: 1200 }, alignSelf: 'center', marginBottom: 5 }}>
                    <Box component='section' sx={{ marginX: { xs: 0, sm: 2 }, alignSelf: 'center' }}>
                        <Typography variant='h1' sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '3rem', paddingY: 4, fontWeight: 600 }}>Welcome to your LoyelTo space </Typography>
                        <Grid container spacing={1} sx={{ width: '100%' }}>
                            <Grid size={{ xs: 12, sm: 4 }}
                                sx={{
                                    borderRadius: 3,
                                    backgroundColor: 'white'
                                }}>
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
                                        <Typography variant='h2' sx={{
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
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }} sx={{
                                order: { xs: 0, sm: 1 },
                                borderRadius: 3,
                                backgroundColor: 'white'
                            }}>
                                <Box component="section" sx={{
                                    margin: 2,
                                    display: "flex",
                                    justifyContent: 'space-between',

                                }}>
                                    <CustomersOrOffersHeading heading='New customers' chipContent={386} />
                                    <IconButton size="small">
                                        <InfoOutlineIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }} sx={{
                                borderRadius: 3,
                                backgroundColor: 'white',
                                paddingY: { xs: 0, sm: 3 }
                            }}  >
                                <Box component="section" sx={{
                                    marginX: 2,

                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: { xs: 'space-between', sm: 'center' },

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
                            </Grid>
                        </Grid>
                    </Box>
                    {/* </Stack> */}
                    <Box component="section"
                        sx={{
                            marginTop: 4,
                            marginX: { xs: 0, sm: 2 },
                            backgroundColor: theme.palette.neutral.light,
                            boxSizing: 'border-box',
                            padding: 2,
                            borderRadius: 4,
                            width: { xs: '100vw', sm: 'auto' },
                            alignSelf: 'center'
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
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12, sm: 6 }}    >
                                <PromoCard name='Free Pizza Margarita' description='Classic  pizza with tomato sauce, mozzarella, and fresh basil' amount={15} outOf={300} points={15} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}    >
                                <PromoCard name='Free Pizza Margarita' description='Classic  pizza with tomato sauce, mozzarella, and fresh basil' amount={15} outOf={300} points={15} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}    >
                                <PromoCard name='Free Pizza Margarita' description='Classic  pizza with tomato sauce, mozzarella, and fresh basil' amount={15} outOf={300} points={15} />
                            </Grid>

                        </Grid>
                    </Box>
                </Box>
            </Box>
        </>
    )
}