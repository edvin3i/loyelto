import { Typography, TextField, Box, Input, InputAdornment, IconButton } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

interface FormEmailProps {
    handleSubmit: (email: string) => void;
}

export default function FormEmail({ handleSubmit }: FormEmailProps) {
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
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("emailInput") as HTMLInputElement;
                handleSubmit(input.value);
               
            }}
        >
            <Typography variant="h3" color="initial" gutterBottom>Dites-nous votre email</Typography>
            <Input
                required
                id="emailInput"
                defaultValue=""
                type="email"
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
}</Box></InputAdornment></IconButton>