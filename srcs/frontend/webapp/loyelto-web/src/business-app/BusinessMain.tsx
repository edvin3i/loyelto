import { Box, CssBaseline, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles'

const Image = styled('img')({
    width: '100%',

});

export default function BusinessMain() {
    return (
        <>
            <CssBaseline />
            <Box component="header">
                <Typography variant='h4'>My balance</Typography>
                <Stack direction="row" spacing={1}>
                    <Typography variant='h1'>56679</Typography>
                    <Image src="coin_loyl.png"
                        sx={{ height: '5.5rem', width: '5.5rem' }}
                    />
                </Stack>
                <Typography variant='subtitle2'>points that you've distributed to the consumers</Typography>

            </Box>
        </>
    )
}