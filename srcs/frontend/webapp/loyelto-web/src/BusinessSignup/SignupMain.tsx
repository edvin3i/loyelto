import { Typography, Stack, Box } from "@mui/material";
import Steps from "./Steps";

export default function SignupMain() {
    return (
        <Stack direction="column" component="main" sx={{paddingY: 7, boxSizing: 'border-box'}}>
            <Typography variant="h1" color="initial" gutterBottom sx={{textAlign: "center", fontSize: 28, fontWeight: 600}}>
                Fill out your profile
            </Typography>
            <Steps />
        </Stack>
    )
}