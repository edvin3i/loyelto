import { Paper, Stack, Box, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'

const Image = styled('img')({
    width: '100%',

});

export default function ClientPage() {
    return (
        <Box sx={{paddingX: 5, width: 375}}>
            <Paper sx={{paddingX: 5}}>
                <Stack direction="row" gap={6} sx={{alignItems: "center", justifyContent: 'flex-end'}}>
                    <Typography variant="h1" color="initial" 
                    sx={{
                        fontSize: 22,
                        fontWeight: 600
                    }}>Julien</Typography>
                    <Stack sx={{alignItems: "center"}}>
                        <Stack direction="row" >
                            <Typography variant="h2" color="initial"
                            sx={{
                                fontSize: 24, fontWeight: 700
                            }}>256</Typography>
                            <Box >
                                <Image src="coin_loyl.png"
                                    sx={{ height: 24, width: 24}}
                                />
                            </Box>
                        </Stack>
                        <Typography variant="body1" color="initial">points</Typography>
                    </Stack>
                </Stack>
            </Paper>
        </Box>)
}