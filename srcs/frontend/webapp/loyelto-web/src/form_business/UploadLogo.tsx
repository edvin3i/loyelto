import * as React from 'react';
import { Box, Avatar, ButtonBase } from "@mui/material"

export default function UploadLogo(){
    const [logoSrc, setLogoSrc] = React.useState<string | undefined>(undefined);

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file){
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

        </Box>
    )
}