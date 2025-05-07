import { Typography, TextField, Box } from "@mui/material";

export default function FormEmail() {
    return (
        <Box
            component="form"
            autoComplete="off"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submitted");
            }}
        >
            <Typography variant="h3" color="initial">Dites-nous votre email</Typography>
            <TextField
                required
                id="BusinessEmail"
                type="email"
                label="Email"
                defaultValue=""
                variant="standard"
            />
        </Box>
    );
}