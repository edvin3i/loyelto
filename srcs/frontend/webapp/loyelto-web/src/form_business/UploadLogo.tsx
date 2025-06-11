import * as React from 'react';
import { Box, Avatar, ButtonBase, Typography } from "@mui/material"

export default function UploadLogo() {
    const [logoSrc, setLogoSrc] = React.useState<string | undefined>(undefined);

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLogoSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }


    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }}>
            <Typography variant='h3' gutterBottom>Téléchargez votre logo (optionnel)</Typography>
            <ButtonBase
                component="label"
                role={undefined}
                tabIndex={-1} // prevent label from tab focus
                aria-label="Avatar image"
                sx={{
                    borderRadius: '40px',
                    '&:has(:focus-visible)': {
                        outline: '2px solid',
                        outlineOffset: '2px',
                    },
                }}
            >
                <Avatar alt="Upload new avatar" src={logoSrc} />
                <input
                    type="file"
                    accept="image/*"
                    style={{
                        border: 0,
                        clip: 'rect(0 0 0 0)',
                        height: '1px',
                        margin: '-1px',
                        overflow: 'hidden',
                        padding: 0,
                        position: 'absolute',
                        whiteSpace: 'nowrap',
                        width: '1px',
                    }}
                    onChange={handleLogoChange}
                />
            </ButtonBase>

        </Box>
    )
}