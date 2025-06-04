import { Card, Box, Stack, Typography, CardMedia, Button } from "@mui/material";
import { useTheme, Theme } from '@mui/material/styles'

export default function PromoCard(){
    const theme = useTheme<Theme>();
    return (
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
    )
}