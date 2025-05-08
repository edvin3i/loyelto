import { Typography, TextField, Box, IconButton, InputAdornment, Input, InputLabel } from "@mui/material";
import React from "react";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';



interface FormTextProps {
    h: string,
    // lab: string,
    handleSubmit: (value: string) => void;
}

export default function FormText({ h, handleSubmit }: FormTextProps) {
    return (
        <Box
            component="form"
            
            autoComplete="off"
        
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: 18,
                width: '70%'
            }}
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submitted");
                console.dir(e.target)
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("textInput") as HTMLInputElement;
                handleSubmit(input.value);
                // handleSubmit(e.target.value)
            }}
        >
            <Typography variant="h3" color="initial" gutterBottom sx={{marginBottom: 5}}>{h}</Typography>
            {/* <InputLabel htmlFor="textInput">{lab}</InputLabel> */}
            <Input
                required
                id="textInput"
                defaultValue=""
                type="text"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton type='submit' >
                            <ArrowCircleRightIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </Box>
    );
}