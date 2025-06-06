import { AppBar, IconButton, Toolbar, Stack, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export default function BusinessWebBar() {
    return (
        <AppBar
            position="fixed"
            color="secondary"
            sx={{
                top: 'auto',
                bottom: 0,
                display: { xs: 'flex', sm: 'none' },
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Stack>
                    <IconButton color="inherit" aria-label="open drawer">
                        <HomeOutlinedIcon />
                    </IconButton>
                    <Typography variant='body2'>Home</Typography>
                </Stack>

                {/* <Box sx={{ flexGrow: 1 }} /> */}
                <IconButton color="inherit">
                    <QrCodeScannerOutlinedIcon />
                </IconButton>
                <IconButton color="inherit">
                    <PersonOutlineOutlinedIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )

}