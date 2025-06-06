import { Card, Box, Stack, Typography, CardMedia, Button, Grid } from "@mui/material";
import { useTheme, Theme } from '@mui/material/styles'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface PromoCardProps {
    name: string;
    description: string;
    amount: number;
    outOf: number;
    points: number;
}

export default function PromoCard({ name, description, amount, outOf, points }: PromoCardProps) {
    const theme = useTheme<Theme>();
    return (
        <Card variant='outlined' sx={{ padding: 1, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Stack direction="column" sx={{ flexGrow: 1, paddingRight: 3 }}>
                    <Typography variant="h5" color="initial" gutterBottom
                        sx={{ fontWeight: '600', fontSize: '1.3rem' }}
                    >{name}</Typography>
                    <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
                        {description}</Typography>
                    <Typography variant='h6' gutterBottom sx={{ fontSize: '1rem', fontWeight: 700 }}>
                        <span style={{ color: 'green' }}>{amount}</span>/{outOf} left
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant='contained' fullWidth color='neutral'
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderRadius: 2
                            }}>Edit promo</Button>

                        <Button variant="contained" size='small' color='error' sx={{paddingX: 0}}>
                            <DeleteOutlineIcon />
                            </Button>
                    </Stack>
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
                        <Box sx={{ fontSize: '1.7rem', fontWeight: 700, display: 'flex', justifyContent: 'center', color: theme.palette.info.dark }}>
                            {points}
                        </Box>
                        <Box>points</Box>
                    </Stack>
                </Stack>
            </Box>
        </Card>
    )
}