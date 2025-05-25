import { Stack, Typography, Chip } from "@mui/material";
import { useTheme, Theme } from '@mui/material/styles'

interface CustomersOrOffersHeadingProps {
    heading: string;
    chipContent: number;
}

export default function CustomersOrOffersHeading({heading, chipContent}: CustomersOrOffersHeadingProps){
    const theme = useTheme<Theme>();
    return (
        <Stack direction="row">
                    <Typography variant='h6' color='initial' gutterBottom sx={{ fontWeight: 600 }}>{heading}:</Typography>
                    <Chip label={chipContent} size="small" sx={{
                        backgroundColor: theme.palette.info.main,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        marginTop: 0.5,
                        marginLeft: 1
                    }} />
                </Stack>
    )
}