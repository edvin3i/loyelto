import { Paper, Stack, Box, Typography, Button, Card, CardContent, CardActionArea, CardActions } from "@mui/material"
import { styled } from '@mui/material/styles'
import { useTheme, Theme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CustomersOrOffersHeading from "./CustomersOrOffersHeading";
import OfferImage from "./OfferImage";
import BusinessWebBar from "./BusinessWebBar";

const Image = styled('img')({
    width: '100%',

});

export default function ClientPage() {
    const theme = useTheme<Theme>();
    return (
        <>
        <Box sx={{ paddingX: 2, paddingTop: 6, width: '100vw', boxSizing: 'border-box' }}>
            <Paper
                sx={{
                    paddingX: 2,
                    paddingY: 1,
                    border: '2.5px solid',
                    
                    borderColor: theme.palette.neutral.light,
                    boxShadow: '0 0 8px 2px ' + theme.palette.neutral.light,
                    backdropFilter: 'blur(2px)',
                    borderRadius: 3
                }}
                id="ClientsNameAndPoints"
            >
                <Stack direction="row" gap={14} sx={{ alignItems: "center", justifyContent: 'flex-end' }}>
                    <Typography variant="h1" color="initial"
                        sx={{
                            fontSize: 24,
                            fontWeight: 600
                        }}>Julien</Typography>
                    <Stack sx={{ alignItems: "center" }}>
                        <Stack direction="row" spacing={1} >
                            <Typography variant="h2" color="initial"
                                sx={{
                                    fontSize: 26, fontWeight: 700
                                }}>256</Typography>
                            <Box sx={{ alignSelf: 'center' }}>
                                <Image src="coin_loyl.png"
                                    sx={{ height: 20, width: 20 }}
                                />
                            </Box>
                        </Stack>
                        <Typography variant="body1" color="initial">points</Typography>
                    </Stack>
                </Stack>
            </Paper>
            <Stack id="AddWithdrawButtons" spacing={2} sx={{ marginY: 4 }}>
                <Button variant="contained" size="large" endIcon={<AddIcon />} color='success' fullWidth disableElevation
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 20, paddingY: 1.5 }}>
                    Add points
                </Button>
                <Button variant="contained" size="large" endIcon={<RemoveIcon />} color='error' fullWidth disableElevation
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 20, paddingY: 1.5 }}>
                    Withdraw points
                </Button>
            </Stack>
            <Stack id="AvailableVouchers" spacing={2} sx={{paddingY: 2}}>
                <CustomersOrOffersHeading heading="Available vouchers" chipContent={1} />
                <Stack direction="row" sx={{ borderRadius: 3}}>
                    <Card
                        variant="outlined"
                        sx={{
                            width: '74%',
                            // border: '2px solid',
                            // borderColor: "#8dbce2",
                            borderRightStyle: 'none',
                            borderRadius: 3,
                            boxShadow: '-1.5px 0 4px  ' + theme.palette.neutral.dark,
                        }}
                    >
                        <CardActionArea>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    color="initial"
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 600,
                                    }}
                                >
                                    Free Pizza Margarita
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Classic pizza with tomato sauce, mozzarella, and fresh basil
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button
                                size="medium"
                                variant="contained"
                                fullWidth
                                disableElevation
                                sx={{
                                    fontWeight: 600,
                                    fontSize: 16,
                                    textTransform: 'none',
                                    marginRight: 3,
                                    borderRadius: 2,
                                }}
                            >
                                Use voucher
                            </Button>
                        </CardActions>
                    </Card>
                    <Card variant="outlined" sx={{ width: '26%', 
                       
                        borderRadius: 2,
                       
                        // border: '2.5px solid',
                          
                        // borderColor: theme.palette.neutral.dark,
                        // boxShadow: '2px 0px 2px -1px ' + theme.palette.neutral.dark + ', 0px 2px 2px -1px ' + theme.palette.neutral.dark + ', 0px -1.5px 1.5px -1px ' + theme.palette.neutral.dark,
                       boxShadow: '-2px 0px white' + ', 2px 0px 8px ' + theme.palette.neutral.dark,
                        borderLeft: 'none',
                        //  backdropFilter: 'blur(1px)',
                         borderLeftStyle: 'none',
                         borderLeftWidth: 0
                        }}>
                        <CardActionArea sx={{ margin: 1 }}>
                            <OfferImage url="pizza-nobg.png" />
                        </CardActionArea>
                    </Card>
                </Stack>
            </Stack>
                     
        </Box >
        {/* <BusinessWebBar /> */}
        </>
        )
}