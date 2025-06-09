import { Box, CardMedia } from "@mui/material";
import { useTheme, Theme } from '@mui/material/styles'

interface OfferImageProps {
    url: string;
}

export default function OfferImage({ url }: OfferImageProps) {
    const theme = useTheme<Theme>();
    return (
        <Box sx={{ backgroundColor: theme.palette.info.light, borderRadius: 1, width: 76 }}>
            <CardMedia
                component="img"
                sx={{ width: 75 }}
                image={url}
                alt="Image of the offer"
            />
        </Box>
    )
}